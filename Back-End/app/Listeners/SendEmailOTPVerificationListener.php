<?php

namespace App\Listeners;

use App\Events\EmailVerification;
use App\Mail\SendOtpEmail;
use App\Services\AuthService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendEmailOTPVerificationListener
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
    public function handle(EmailVerification $event): void
    {
        $user = $event->user;

        // Generate OTP
        $otp = rand(100000, 999999);

        // Save OTPs
        $this->authService->saveEmailOtp($user->id, $otp);

        // Send Email OTP
        Mail::to($user->email)->queue(new SendOtpEmail($otp));

    }
}
