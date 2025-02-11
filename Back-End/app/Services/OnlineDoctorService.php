<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\DoctorOnlineSchedule;

class OnlineDoctorService
{
    /**
     * Get all online schedules for a doctor.
     *
     * @param int $doctorId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getSchedules( $doctorId)
    {

        return DoctorOnlineSchedule::query()->where('doctor_id', $doctorId)->get();

    }

    /**
     * Update a specific schedule.
     *
     * @param int $scheduleId
     * @param array $data
     * @return DoctorOnlineSchedule
     */
    public function updateSchedule(Doctor $doctor,int $scheduleId, array $data)
    {
        $schedule = $doctor->online_schedule()->findOrFail($scheduleId);
        // Update the schedule with the provided data
        $schedule->update($data);

        return $schedule;
    }

    /**
     * Toggle the online status for a doctor.
     *
     * @param int $doctorId
     * @return Doctor
     */
    public function toggleOnlineStatus(int $doctorId)
    {
        $doctor = Doctor::findOrFail($doctorId);
        $doctor->online_active = !$doctor->online_active;
        $doctor->save();
        return $doctor;
    }

    /**
     * Create a new schedule for a doctor.
     *
     * @param int $doctorId
     * @param array $data
     * @return DoctorOnlineSchedule
     */
    public function createSchedule(int $doctorId, array $data)
    {
        return DoctorOnlineSchedule::create(array_merge($data, ['doctor_id' => $doctorId]));
    }

    /**
     * Delete a specific schedule.
     *
     * @param int $scheduleId
     * @return void
     */
    public function deleteSchedule(int $scheduleId)
    {
        $schedule = DoctorOnlineSchedule::findOrFail($scheduleId);
        $schedule->delete();
    }
}

