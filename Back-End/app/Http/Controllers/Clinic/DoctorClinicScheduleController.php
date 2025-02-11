<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorClinicScheduleRequest;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorClinicSchedule;
use App\Services\DoctorClinicScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DoctorClinicScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(DoctorClinicScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function show(Doctor $doctor,int $clinic_id): JsonResponse
    {
        $schedules = $this->scheduleService->getSchedulesByDoctor($doctor, $clinic_id);
        return response()->json($schedules);
    }


    public function update(DoctorClinicScheduleRequest $request, Doctor $doctor, Clinic $clinic, $id): JsonResponse
    {
        Gate::authorize('update',[DoctorClinicSchedule::class, $doctor]);

        $schedule = $this->scheduleService->updateSchedule($doctor, $clinic,$id, $request->validated());
        return response()->json(['message' => 'Schedule updated successfully', 'data' => $schedule]);
    }

}
