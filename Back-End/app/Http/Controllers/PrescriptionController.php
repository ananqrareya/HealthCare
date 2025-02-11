<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrescriptionRequest;
use App\Models\Prescription;
use Illuminate\Support\Facades\Gate;

class PrescriptionController extends Controller
{
    /**
     * Store a newly created prescription in the database.
     *
     * @param  \App\Http\Requests\StorePrescriptionRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */



    public function store(StorePrescriptionRequest $request): \Illuminate\Http\JsonResponse
    {
        Gate::authorize('create',Prescription::class);
        if (!$request->file('prescription_file')) {
            return response()->json([
                'message' => 'prescription not found',
            ], 201);
        }
        $file = $this->uploadToCloudinary($request->file('prescription_file'), 'prescriptions');
        $validated = $request->validated();

        $prescription = Prescription::query()
            ->create([
                'appointment_id' => $validated['appointment_id'],
                'file_path' => $file['url'],
                'public_id' => $file['public_id'],
                'date' => now()->format('Y-m-d'),
                'medications' =>isset($validated['medications']) ? json_encode($validated['medications']) : null,
            ]);


        return response()->json([
            'message' => 'Prescription saved successfully!',
            'prescription' => $prescription,
        ], 201);
    }

    private function uploadToCloudinary($file, string $folder)
    {
        $cloudinaryFile = $file->storeOnCloudinary($folder);
        return [
            'url' => $cloudinaryFile->getSecurePath(),
            'public_id' => $cloudinaryFile->getPublicId(),
        ];
    }

}
