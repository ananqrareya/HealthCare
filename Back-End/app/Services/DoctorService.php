<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\DoctorOnlineSchedule;
use Illuminate\Support\Facades\DB;

class DoctorService
{
    /**
     * Store a new doctor record.
     *
     * @param array $data
     * @return Doctor
     */
    public function store(array $data): Doctor
    {
        return DB::transaction(function () use ($data) {
            return Doctor::create($data);
        });
    }

    /**
     * Update an existing doctor record.
     *
     * @param Doctor $doctor
     * @param array $user_data
     * @param array $doctor_data
     * @return Doctor
     */
    public function update(Doctor $doctor, array $user_data, array $doctor_data): Doctor
    {

        return DB::transaction(function () use ($doctor, $user_data, $doctor_data) {
            // Update associated user data
            $doctor->user()->update($user_data);

            // Update doctor-specific data
            $doctor->update($doctor_data);

            return $doctor;
        });
    }

    /**
     * Delete a doctor record.
     *
     * @param Doctor $doctor
     * @return bool
     */
    public function delete(Doctor $doctor): bool
    {
        return DB::transaction(function () use ($doctor) {
            return $doctor->delete();
        });
    }

    /**
     * Find a doctor by ID.
     *
     * @param int $id
     * @return Doctor|null
     */
    public function find($id): ?Doctor
    {
        return Doctor::with('user')->findOrFail($id);
    }

    /**
     * Get all doctor records.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return Doctor::with('user')->get();
    }

}
