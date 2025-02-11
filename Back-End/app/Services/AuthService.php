<?php

namespace App\Services;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{


    /**
     * @throws \Exception
     */
    public function saveEmailOtp(int $userId, int $otp): void
    {
        $user = User::query()->findOrFail($userId);

        // Check resend limits
        $maxResendAttempts = 3;
        $timeWindow = 5;

        if (
            $user->email_otp_resend_count >= $maxResendAttempts &&
            $user->email_otp_last_sent_at &&
            $user->email_otp_last_sent_at->diffInMinutes(now()) < $timeWindow
        ) {
            throw new \Exception('Maximum OTP resend attempts reached. Please try again later.');
        }

        // Update resend count and timestamp
        if (!$user->email_otp_last_sent_at || $user->email_otp_last_sent_at->diffInMinutes(now()) >= $timeWindow) {
            $user->email_otp_resend_count = 0;
        }

        $user->email_otp_resend_count += 1;
        $user->email_otp_last_sent_at = now();
        $user->save();

        DB::table('email_otps')->updateOrInsert(
            ['user_id' => $userId],
            ['otp' => $otp, 'created_at' => now()]
        );
    }

    /**
     * @throws \Exception
     */

    public function resetPassword(Request $request): void
    {

        $request->only( 'password', 'password_confirmation');

        $user = Auth::user();

        $user->forceFill([
            'password' => Hash::make($request->string('password')),
            'remember_token' => Str::random(60),
        ])->save();

        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

    }
    public function savePhoneOtp(int $userId, int $otp): void
    {
        $user = User::query()->findOrFail($userId);

        // Check resend limits
        $maxResendAttempts = 3;
        $timeWindow = 5;

        if (
            $user->phone_otp_resend_count >= $maxResendAttempts &&
            $user->phone_otp_last_sent_at &&
            $user->phone_otp_last_sent_at->diffInMinutes(now()) < $timeWindow
        ) {
            throw new \Exception('Maximum OTP resend attempts reached. Please try again later.');
        }

        // Update resend count and timestamp
        if (!$user->phone_otp_last_sent_at || ($user->otp_last_sent_at && $user->otp_last_sent_at->diffInMinutes(now()) >= $timeWindow)) {
            $user->phone_otp_resend_count = 0;
        }

        $user->phone_otp_resend_count += 1;
        $user->phone_otp_last_sent_at = now();
        $user->save();

        // Save or update OTP

        DB::table('phone_otps')->updateOrInsert(
            ['user_id' => $userId],
            ['otp' => $otp, 'created_at' => now()]
        );
    }

    public function verifyEmailOtp(int $userId, int $otp): bool
    {
        $record = DB::table('email_otps')->where('user_id', $userId)->first();

        return $record && $record->otp == $otp && now()->diffInMinutes($record->created_at) <= 3;
    }

    public function verifyPhoneOtp(int $userId, int $otp): bool
    {
        $record = DB::table('phone_otps')->where('user_id', $userId)->first();

        return $record && $record->otp == $otp && now()->diffInMinutes($record->created_at) <= 3;
    }


}
