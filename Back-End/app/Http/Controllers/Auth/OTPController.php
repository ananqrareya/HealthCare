<?php

namespace App\Http\Controllers\Auth;

use App\Events\EmailVerification;
use App\Events\PhoneVerification;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OTPController extends Controller
{
    protected $smsService;
    private UserService $userService;
    private AuthService $authService;

    public function __construct( UserService $userService, AuthService $authService)
    {
        $this->userService = $userService;
        $this->authService= $authService;
    }

    public function sendPhoneOTP(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::query()->findOrFail($request->post('user_id'));

       event(new PhoneVerification($user));

        return response()->json(['message' => 'OTP sent successfully']);
    }

    public function resendEmailOTP(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = $this->userService->findById($request->user_id);

            event(new EmailVerification($user));

            return response()->json([
                'message' => 'OTP resent successfully.',
            ], 200);

    }

}
