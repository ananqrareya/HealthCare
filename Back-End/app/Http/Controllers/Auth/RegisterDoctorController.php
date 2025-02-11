<?php

namespace App\Http\Controllers\Auth;

use AllowDynamicProperties;
use App\Enums\Role;
use App\Events\EmailVerification;
use App\Events\PhoneVerification;
use App\Http\Requests\auth\RegisterDoctorStepOneRequest;
use App\Services\DoctorService;
use App\Services\SMSService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;


#[AllowDynamicProperties] class RegisterDoctorController
{

    /**
     * @var DoctorService
     */
    protected $doctorService;
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @param DoctorService $doctorService
     * @param UserService $userService
     */
    public function __construct(DoctorService $doctorService, UserService $userService, smsService $smsService)
    {
        $this->doctorService = $doctorService;
        $this->userService = $userService;
        $this->smsService= $smsService;
    }

    /**
     * @param RegisterDoctorStepOneRequest $request
     * @return JsonResponse
     */
    public function storeStepOne(RegisterDoctorStepOneRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['role_id'] = Role::Doctor->value;
            $data['is_active'] = false;

            $user = $this->userService->createUser($data);

            event(new EmailVerification($user));
            event(new PhoneVerification($user));

            return response()->json([
                'message' => 'Doctor created successfully. Please verify your email.',
                'user_id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }




}
