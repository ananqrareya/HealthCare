<?php

namespace App\Http\Controllers\Auth;

use App\Events\PhoneVerification;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    public function __construct(public AuthService $authService, public UserService $userService)
    {

    }

    /**
     * Handle an incoming new password request.
     *
     */
    public function resetPasswordToAuthUser(Request $request): JsonResponse
    {
        $request->validate([
            'old_password' => ['required'],
            'password' => [
                'required',
                'confirmed',
                'string',
                'min:6',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#]/',
            ],
        ]);

        // Check if the old password matches the current password
        if (!Hash::check($request->old_password, auth()->user()->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Your current password does not match our records.',
                ], 422);
        }


        $this->authService->resetPassword($request);

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.',
        ]);
    }


    public function SendOtpToForgetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email_or_username_or_phone' => ['required'],
        ]);


        $value = $request->input('email_or_username_or_phone');
        $user = User::query()
            ->where('email', '=', $value)
            ->orWhere('username', '=', $value)
            ->orWhere('phone', '=', $value)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User does not exist.',
            ]);

        }

        event(new PhoneVerification($user));

        return response()->json([
            'success' => true,
            'user_id'=>$user->id,
            'message' => 'We have sent you a OTP on phone to reset your password.',

        ]);
    }

    public function generateResetPasswordToken(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|integer',
        ]);

        $user = $this->userService->findById($request->user_id);

        if ($this->authService->verifyPhoneOtp($user->id, $request->otp)) {
            $user->phone_verified_at = now();
            $user->save();

            $resetToken = Str::random(64);
            $resetToken = Hash::make($resetToken);

             DB::table('password_reset_tokens')->updateOrInsert(
                ['user_id' => $user->id],
                [
                    'token' => $resetToken,
                    'created_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Password reset token generated successfully.',
                'reset_token' => $resetToken,
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid OTP or expired.',
        ], 400);

    }


    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed', // Ensure the password is strong and confirmed
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token.',
            ], 400);
        }

        $tokenLifetime = config('auth.passwords.users.expire', 60);
        if (now()->diffInMinutes($resetRecord->created_at) > $tokenLifetime) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired.',
            ], 400);
        }

        // Find the user and update the password
        $user = User::find($resetRecord->user_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User does not exist.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the reset token after successful reset
        DB::table('password_reset_tokens')->where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.',
        ], 200);
    }


}
