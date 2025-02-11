<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Role;
use App\Events\PhoneVerification;
use App\Http\Controllers\Controller;
use App\Http\Requests\auth\RegisterPatientRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class RegisterPatientController extends Controller
{
    protected $userService;

    /**
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @param RegisterPatientRequest $request
     * @return JsonResponse
     */
    public function store(RegisterPatientRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['role_id'] = Role::Patient->value;
            $data['is_active'] = true;

            $user = $this->userService->createUser($data);


            event(new PhoneVerification($user));


            return response()->json([
                'message' => 'Patient created successfully. Please verify your email.',
                'user_id' => $user->id,
                'phone' => $user->phone,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
