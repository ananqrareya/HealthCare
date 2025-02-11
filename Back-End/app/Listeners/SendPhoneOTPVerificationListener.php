<?php

namespace App\Listeners;

use App\Events\PhoneVerification;
use App\Notifications\VerifyPhoneWithOTP;
use App\Services\AuthService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPhoneOTPVerificationListener
{
    /**
     * Create the event listener.
     */
    public function __construct(protected AuthService $authService)
    {

    }

    /**
     * Handle the event.
     */
    public function handle(PhoneVerification $event): void
    {
        $user = $event->user;

        // Generate OTP
        $otp = rand(100000, 999999);

        $this->authService->savePhoneOtp($user->id, $otp);

        // Send SMS OTP
        $user->notify(new VerifyPhoneWithOTP($otp));

    }
}
