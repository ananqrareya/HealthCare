<?php


use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisterDoctorController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'generateToken'])->name('login');

Route::middleware(['auth:sanctum'])->post('/reset/password', [\App\Http\Controllers\Auth\NewPasswordController::class, 'resetPasswordToAuthUser'])->name('reset.password');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::post('/patient/register', [\App\Http\Controllers\Auth\RegisterPatientController::class, 'store'])->name('patient.register');


Route::post('doctor/register', [\App\Http\Controllers\Auth\RegisterDoctorController::class, 'storeStepOne'])
    ->name('doctor.register');


Route::post('/resend-email-otp', [\App\Http\Controllers\Auth\OTPController::class, 'resendEmailOTP'])
    ->name('resend-email-otp');


Route::post('/resend-phone-otp', [\App\Http\Controllers\Auth\OTPController::class, 'sendPhoneOTP'])
    ->name('resend-phone-otp');


Route::post('verify-phone', [\App\Http\Controllers\Auth\VerificationController::class, 'verifyPhone'])
    ->name('verify-phone');

Route::post('/verify-email', [\App\Http\Controllers\Auth\VerificationController::class, 'verifyEmail'])
    ->name('verify-email');

Route::put('/update-email', [VerificationController::class, 'updateEmail']);
Route::put('/update-phone', [VerificationController::class, 'updatePhone']);


Route::post('forget-password/send-otp',[NewPasswordController::class, 'SendOtpToForgetPassword'])->name('forget.password.send-otp');
Route::post('forget-password/generate-token',[NewPasswordController::class, 'generateResetPasswordToken']);
Route::post('forget-password/reset-password',[NewPasswordController::class, 'resetPassword']);
