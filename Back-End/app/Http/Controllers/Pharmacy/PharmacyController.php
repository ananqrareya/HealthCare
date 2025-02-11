<?php

namespace App\Http\Controllers\Pharmacy;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePharmacyRequest;
use App\Http\Requests\UpdatePharmacyRequest;
use App\Http\Resources\PharmacyCollection;
use App\Http\Resources\PharmacyResource;
use App\Models\Pharmacy;
use App\Services\Map\PositionService;
use App\Services\PharmacyService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class PharmacyController extends Controller
{
    protected $pharmacyService;
    protected $userService;

    public function __construct(PharmacyService $pharmacyService, UserService $userService)
    {
        $this->pharmacyService = $pharmacyService;
        $this->userService = $userService;
    }

    public function store(StorePharmacyRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['role_id']=Role::PharmacyUser->value;

        $user = $this->userService->createUser($data);

        return (new PharmacyResource($user->pharmacy))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Pharmacy created successfully');

    }


    public function update(UpdatePharmacyRequest $request, Pharmacy $pharmacy): JsonResponse
    {



        $user_data = $request->only([
            'en_first_name',
            'en_last_name',
            'first_name',
            'last_name',
            'username',
            'email',
            'phone',
            'is_active',
            'password',
            'dob'
        ]);

        $pharmacy_data = $request->only([
            'license_number',
            'ar_name',
            'en_name',
            'street_name',
            'build_name',
            'city_id',
            'pharmacy_phone',
        ]);

        $pharmacy_data = $this->pharmacyService->handelAddress($request,$pharmacy,$pharmacy_data);
        $pharmacy = $this->pharmacyService->update($pharmacy,$user_data, $pharmacy_data);

        return (new PharmacyResource($pharmacy))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'Pharmacy updated successfully');
    }

    public function show($id): JsonResponse
    {
        $pharmacy = $this->pharmacyService->find($id);

        return (new PharmacyResource($pharmacy))
            ->response()
            ->setStatusCode(200);
    }

    public function destroy(Pharmacy $pharmacy): JsonResponse
    {
        $this->pharmacyService->delete($pharmacy);

        return response()->json([
            'message' => 'Pharmacy deleted successfully'
        ], 200);
    }

    public function index(): JsonResponse
    {
        $pharmacies = Pharmacy::all();

        return (new PharmacyCollection($pharmacies))
            ->response()
            ->setStatusCode(200);
    }
}
