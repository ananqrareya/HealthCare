<?php

namespace App\Jobs;

use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CancelUnfinishedAppointments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Appointment::query()
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->where('appointments.visit_type','=','online')
            ->where('appointments.status', '=', 'pending')
            ->whereDate('appointments.date', '=', Carbon::today())
            ->whereRaw("appointments.time <= TIMESTAMPADD(MINUTE,(60 - doctors.online_appointment_time), NOW())")
            ->update(['appointments.status' => 'cancelled']);

        Appointment::query()
            ->join('clinics', 'appointments.clinic_id', '=', 'clinics.id')
            ->where('appointments.visit_type','=','locale')
            ->where('appointments.status', '=', 'pending')
            ->whereDate('appointments.date', '=', Carbon::today())
            ->whereRaw("appointments.time <= TIMESTAMPADD(MINUTE,(60 - clinics.appointment_time), NOW())")
            ->update(['appointments.status' => 'cancelled']);
    }
}
