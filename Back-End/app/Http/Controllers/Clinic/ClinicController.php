<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClinicRequest;
use App\Http\Requests\UpdateClinicRequest;
use App\Http\Resources\ClinicCollection;
use App\Http\Resources\ClinicResource;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Services\ClinicService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ClinicController extends Controller
{
    protected $clinicService;

    public function __construct(ClinicService $clinicService)
    {
        $this->clinicService = $clinicService;
    }

    public function store(StoreClinicRequest $request): JsonResponse
    {
        Gate::authorize('create',Clinic::class);

        $data = $request->validated();
        $clinic = $this->clinicService->store($data);

        return response()->json([
            'message' => 'Clinic created successfully',
            'data' => new ClinicResource($clinic),
        ], 201);
    }

    public function update(UpdateClinicRequest $request, Clinic $clinic): JsonResponse
    {

        Gate::authorize('update',[Clinic::class, $clinic]);

        $data = $request->validated();

        $clinic = $this->clinicService->update($clinic, $data);

        return response()->json([
            'data' => new ClinicResource($clinic),
            'message' => 'Clinic updated successfully'
        ], 200);
    }

    public function show($id): JsonResponse
    {
        $clinic = $this->clinicService->find($id);

        return response()->json([
            'data' => new ClinicResource($clinic)
        ], 200);
    }

    public function destroy(Clinic $clinic): JsonResponse
    {
        Gate::authorize('delete',[Clinic::class, $clinic]);

        $this->clinicService->delete($clinic);

        return response()->json([
            'message' => 'Clinic deleted successfully'
        ], 200);
    }

    public function index(): JsonResponse
    {

        $clinics = $this->clinicService->getAll();

        return (new ClinicCollection($clinics))
            ->response()
            ->setStatusCode(200);
    }
}
