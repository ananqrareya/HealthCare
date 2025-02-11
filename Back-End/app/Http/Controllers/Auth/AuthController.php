<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use thiagoalessio\TesseractOCR\TesseractOCR;

class AuthController extends Controller
{
    // Method to handle user authentication and token generation
    public function generateToken(LoginRequest $request)
    {


        $user = User::where('username', $request->username)->first() ;

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }


        $deviceName = $request->header('User-Agent');
         $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // Method to handle user logout and token revocation
    public function logout(Request $request)
    {
        // Revoke all tokens...
        $request->user()->tokens()->delete();

        // // Revoke the current token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'You have been successfully logged out.'], 200);
    }


    public function register(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

// Path to the scanned image
        $imagePath = $request->file('image');

// Create a new instance of TesseractOCR
        $tesseract = new TesseractOCR($imagePath);

// Set the language of the text in the image
        $tesseract->lang('ar');

// Get the text from the image
        $text = $tesseract->run();

// Print the extracted text
        return $text;

    }
}
