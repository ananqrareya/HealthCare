<?php

namespace App\Http\Controllers\Auth;

use App\Events\EmailVerification;
use App\Events\PhoneVerification;
use App\Http\Controllers\Controller;
use App\Mail\SendOtpEmail;
use App\Services\AuthService;
use App\Services\DoctorService;
use App\Services\SMSService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
class VerificationController extends Controller
{

    public function __construct(DoctorService $doctorService, UserService $userService, AuthService $authService)
    {
        $this->doctorService = $doctorService;
        $this->userService = $userService;
        $this->auhtService= $authService;
    }
    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|integer',
        ]);

        $user = $this->userService->findById($request->user_id);

        if ($this->auhtService->verifyEmailOtp($user->id, $request->otp)) {
            $user->email_verified_at = now();
            $user->save();

            return response()->json([
                'message' => 'Email verified successfully.',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid OTP or expired.',
        ], 400);
    }
    public function verifyPhone(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|integer',
        ]);

        $user = $this->userService->findById($request->user_id);

        if ($this->auhtService->verifyPhoneOtp($user->id, $request->otp)) {
            $user->phone_verified_at = now();
            $user->save();
            return response()->json([
                'message' => 'Phone verified successfully. Registration complete.',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid OTP or expired.',
        ], 400);
    }



    public function updateEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'email' => 'required|email|unique:users,email',
        ]);

        $user = $this->userService->findById($validated['user_id']);

        // Update the user's email
        $user->email = $validated['email'];
        $user->email_verified_at = null; // Reset email verification
        $user->save();

        event(new EmailVerification($user));


        return response()->json([
            'message' => 'Email updated successfully. Please verify your new email.',
            'email' => $user->email,
        ], 200);
    }

    public function updatePhone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'phone' => 'required|string|max:14',
        ]);

        $user = $this->userService->findById($validated['user_id']);

        // Update the user's email
        $user->phone = $validated['phone'];
        $user->phone_verified_at = null; // Reset phone verification
        $user->save();

        event(new PhoneVerification($user));


        return response()->json([
            'message' => 'Phone updated successfully. Please verify your new Phone.',
            'phone' => $user->phone,
        ], 200);
    }
}
