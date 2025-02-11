<?php

namespace App\Services;

use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorClinicSchedule;


class DoctorClinicScheduleService
{
    public function getSchedulesByDoctor(Doctor $doctor,int $clinic_id)
    {


        $clinic = $doctor->clinics()->findOrFail($clinic_id);


        return $clinic->clinic_schedule;


    }


    public function updateSchedule(Doctor $doctor,Clinic $clinic,$id, array $data): DoctorClinicSchedule
    {
        $schedule = $clinic->clinic_schedule()->findOrFail($id);

        $new_data = [
            'start_time' => $data['start_time'] ?? $schedule->start_time,
            'end_time' => $data['end_time'] ?? $schedule->end_time,
            'available' => $data['available'] ?? $schedule->available,
        ];
        $schedule->update($new_data);
        return $schedule;
    }
}

