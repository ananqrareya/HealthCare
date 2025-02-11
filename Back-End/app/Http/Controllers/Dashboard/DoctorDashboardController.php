<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Category;
use App\Models\City;
use App\Models\Doctor;
use App\Models\Laboratory;
use App\Models\Patient;
use App\Models\Pharmacy;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use function Illuminate\Events\queueable;

class DoctorDashboardController extends Controller
{
    public function __invoke(): \Illuminate\Http\JsonResponse
    {
        if (!Gate::allows('view-doctor-dashboard')) {
            abort(403, 'Unauthorized'); // Restrict access
        }
        $user = auth()->user();
        $completed_appointment_count = $user->doctor->appointments->where('status', 'completed')->count();
        $canceled_appointment_count  = $user->doctor->appointments->where('status', 'cancelled')->count();
        $pending_appointment_count   = $user->doctor->appointments->where('status', 'pending')->count();
        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        $completed_online_appointment_count = $user
            ->doctor
            ->appointments
            ->where('status', 'completed')
            ->where('visit_type', 'online')
            ->whereBetween('date', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $completed_clinic_appointment_count = $user
            ->doctor
            ->appointments
            ->where('status', 'completed')
            ->where('visit_type', 'locale')
            ->whereBetween('date', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $online_fee = $user->doctor->online_fee;
        $clinic_fee = $user->doctor->fee;
        $salary_for_last_month = ($completed_online_appointment_count * $online_fee) + ($completed_clinic_appointment_count * $clinic_fee);



        $startDate = Carbon::now()->subMonths(6)->startOfMonth(); // 6 months ago (beginning of the month)
        $endDate = Carbon::now()->endOfMonth(); // End of the current month

        $appointmentsPerMonth = Appointment::where('doctor_id', $user->doctor->id)
            ->where('status', 'completed')
            ->whereBetween('date', [$startDate, $endDate]) // Filter last 6 months
            ->selectRaw("DATE_FORMAT(date, '%Y-%m') as month, COUNT(*) as total_appointments")
            ->groupBy('month')
            ->orderBy('month', 'ASC')
            ->get();
        return response()->json([
            'completed_appointment_count' => $completed_appointment_count,
            'canceled_appointment_count' => $canceled_appointment_count,
            'pending_appointment_count' => $pending_appointment_count,
            'patients_count' => $user->doctor->patients->count(),
            'salary_for_last_month' => $salary_for_last_month,
            'appointments_per_month' =>  $appointmentsPerMonth,

        ]);

    }
}
