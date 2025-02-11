<?php

namespace App\Http\Controllers\Patient;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientCollection;
use App\Http\Resources\PatientResource;
use App\Models\Doctor;
use App\Models\Patient;
use App\Services\PatientService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

/**
 *
 */
class PatientController extends Controller
{
    /**
     * @var PatientService
     */
    protected $patientService;
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @param PatientService $patientService
     * @param UserService $userService
     */
    public function __construct(PatientService $patientService, UserService $userService)
    {
        $this->patientService = $patientService;
        $this->userService = $userService;
    }

    /**
     * Store a new patient.
     */
    public function store(StorePatientRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['role_id']=Role::Patient->value;

        $user = $this->userService->createUser($data);

        return response()->json([
            'message' => 'Patient created successfully',
            'data' => new PatientResource($user->patient)
        ], 201);
    }

    /**
     * Update an existing patient.
     */
    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $validated_data = $request->validated();

        $user_data = $request->only([
            'first_name',
            'last_name',
            'username',
            'email',
            'phone',
            'is_active',
            'password',
            'dob'
        ]);
        $patient_data = $request->only([
            'id_number',
            'blood_type',
            'emergency_contact_name',
            'emergency_contact_phone'

        ]);

        $patient = $this->patientService->update($patient, $user_data, $patient_data);

        return response()->json([
            'message' => 'Patient updated successfully',
            'data' => new PatientResource($patient),
        ], 200); // 200 OK
    }

    /**
     * Show details of a specific patient.
     */
    public function show($id): JsonResponse
    {
        $patient = $this->patientService->find($id);

        return response()->json([
            'data' => new PatientResource($patient)
        ], 200); // 200 OK
    }

    /**
     * Delete a patient.
     */
    public function destroy(Patient $patient): JsonResponse
    {
        $this->patientService->delete($patient);

        return response()->json([
            'message' => 'Patient deleted successfully'
        ], 200);
    }



    /**
     * Get a list of all patients.
     */
    public function index(): JsonResponse
    {
        $patients = $this->patientService->getAll();


        return (new PatientCollection($patients))
            ->response()
            ->setStatusCode(200);

    }

    public function patientForDoctor(Doctor $doctor): JsonResponse
    {
        Gate::authorize('patientForDoctor',Patient::class);

        $patients = Auth::user()->doctor->patients;


        return (new PatientCollection($patients))
            ->response()
            ->setStatusCode(200);
    }
}
