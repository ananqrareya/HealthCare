<?php

namespace App\Services\Scanner;

use App\Enums\Role;
use App\Models\User;
use Exception;
use IDAnalyzer2\Api\Biometric\FaceVerification;
use IDAnalyzer2\Api\Scanner\StandardScan;
use IDAnalyzer2\Client;
use IDAnalyzer2\SDKException;
use Illuminate\Http\Request;

class PatientCardValidationServices
{
    public function __invoke(Request $request): \Illuminate\Http\JsonResponse
    {


        // Validation for inputs
        $request->validate([
            'user_id' => 'required|exists:patients,id',
            'reference' => 'required',
        ]);

        $apiKey = config('services.analyzer.API_KEY');
        $userId = $request->input('user_id');

        try {
            // Fetch user data by user ID
            $userData = $this->getUserData($userId);

            if (!$userData) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $client = new Client($apiKey);

            // ID Card Data Extraction
            $idCardBytes = file_get_contents($request->file('reference'));

            $idScan = new StandardScan();
            $idScan->document = base64_encode($idCardBytes);
            $idScan->profile = "profile_id";

            [$idResult, $idErr] = $client->Do($idScan);

            if ($idErr) {
                return response()->json(['error' => 'ID Card Extraction Error: ' . $idErr->message], 400);
            }


            $fieldsToCheck = ["dobDay", "dobMonth", "dobYear", "dob", "documentNumber"];

            if ($this->hasMissingFields($idResult, $fieldsToCheck)) {

                return response()->json([
                    'error' => 'Some fields are missing from your ID. Please upload a clearer photo',
                    'redirect' => 'id_card',
                ], 400);
            }

            // Compare extracted ID card data with user data
            if (!$this->compareUserData($idResult, $userData)) {
                return response()->json([
                    'error' => 'Extracted data does not match user data',
                    'redirect' => 'user',
                ], 400);
            }


            // Return results
            return response()->json([
                'user_id' => $userId,
                'id_card_extraction' => [
                    'success' => isset($idResult->success) ? $idResult->success : false,
                    'decision' => isset($idResult->decision) ? $idResult->decision : null,
                ],
            ]);

        } catch (SDKException $e) {
            return response()->json(['error' => 'SDKException: ' . $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['error' => 'Exception: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Fetch user data from the database by user ID
     */
    private
    function getUserData($userId)
    {
        return User::query()->findOrFail($userId);
    }

    /**
     * Compare extracted data with user data
     */

    private function compareUserData($extractedData, $userData)
    {
        try {


            $nationalityFull = $extractedData->data->nationalityFull[0]->value;
            $dob = $extractedData->data->dob[0]->value;
            $documentNumber = $extractedData->data->documentNumber[0]->value;

            // Perform comparisons
            if (
                $nationalityFull === 'Palestine' &&
                $dob === $userData->dob &&
                $documentNumber === ($userData->role_id == Role::Doctor->value
                    ? $userData->doctor->id_number
                    : $userData->patient->id_number)
            ) {
                return true; // Comparison successful
            }

            return false;

        } catch (Exception $e) {

            // Return server error response
            return response()->json([
                'error' => 'An internal error occurred during data comparison.'
            ], 500); // Internal Server Error
        }
    }


    private function hasMissingFields($extractedData, $fieldsToCheck)
    {

        // Extract the missing fields
        $missingFields = $extractedData->missingFields ?? null;

        if ($missingFields){

            // Check if any of the required fields are in the missing fields
            foreach ($fieldsToCheck as $field) {

                if (in_array($field, $missingFields)) {
                    return true;
                }
            }

        }


        return false;
    }

}
