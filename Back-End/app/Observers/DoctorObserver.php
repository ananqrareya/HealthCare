<?php

namespace App\Observers;

use App\Models\Doctor;
use App\Models\DoctorClinicSchedule;
use App\Models\DoctorOnlineSchedule;

class DoctorObserver
{
    /**
     * Handle the Doctor "created" event.
     */
    public function created(Doctor $doctor)
    {
        $days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'];

        foreach ($days as $day) {
            DoctorOnlineSchedule::query()->create([
                'doctor_id' => $doctor->id,
                'day' => $day,
                'start_time' => '09:00:00', // Default start time
                'end_time' => '17:00:00',   // Default end time
                'available' => false,
            ]);

        }
    }

}
