<?php

namespace App\Observers;

use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorClinicSchedule;
use App\Models\DoctorOnlineSchedule;

class ClinicObserver
{
    /**
     * Handle the Clinic "created" event.
     */
    public function created(Clinic $clinic)
    {
        $days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'];

        foreach ($days as $day) {
            DoctorClinicSchedule::query()->create([
                'clinic_id' => $clinic->id,
                'day' => $day,
                'start_time' => '09:00:00', // Default start time
                'end_time' => '17:00:00',   // Default end time
                'available' => false,
            ]);

        }
    }

    /**
     * Handle the Clinic "updated" event.
     */
    public function updated(Clinic $clinic): void
    {
        //
    }

    /**
     * Handle the Clinic "deleted" event.
     */
    public function deleted(Clinic $clinic): void
    {
        //
    }

    /**
     * Handle the Clinic "restored" event.
     */
    public function restored(Clinic $clinic): void
    {
        //
    }

    /**
     * Handle the Clinic "force deleted" event.
     */
    public function forceDeleted(Clinic $clinic): void
    {
        //
    }
}
