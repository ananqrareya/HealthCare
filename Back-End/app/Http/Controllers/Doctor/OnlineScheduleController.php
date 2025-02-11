<?php
namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOnlineScheduleRequest;
use App\Models\Doctor;
use App\Models\DoctorOnlineSchedule;
use App\Services\OnlineDoctorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OnlineScheduleController extends Controller
{
    protected $doctorService;

    public function __construct(OnlineDoctorService $doctorService)
    {
        $this->doctorService = $doctorService;
    }

    /**
     * View all online schedules for a doctor.
     *
     * @param int $doctorId
     * @return JsonResponse
     */
    public function viewSchedules($doctorId): JsonResponse
    {
        $schedules = $this->doctorService->getSchedules($doctorId);
        return response()->json([
            'data' => $schedules,
        ]);
    }


    public function updateSingleSchedule(UpdateOnlineScheduleRequest $request,Doctor $doctor, $scheduleId): JsonResponse
    {
        Gate::authorize('update',[DoctorOnlineSchedule::class, $doctor]);


        $schedule = $this->doctorService->updateSchedule($doctor, $scheduleId, $request->validated());

        return response()->json([
            'message' => 'Schedule updated successfully.',
            'schedule' => $schedule,
        ]);
    }


    public function toggleOnlineStatus(Request $request, $doctorId): JsonResponse
    {

        Gate::authorize('toggleStatus',[DoctorOnlineSchedule::class, $doctorId]);

        $doctor = $this->doctorService->toggleOnlineStatus($doctorId);

        return response()->json([
            'message' => 'Online status updated successfully.',
            'online_active' => $doctor->online_active,
        ]);
    }



}

