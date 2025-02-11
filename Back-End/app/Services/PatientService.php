<?php
// app/Services/PatientService.php
namespace App\Services;

use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class PatientService
{
    public function store(array $data): Patient
    {
        return DB::transaction(function () use ($data) {
            return Patient::create($data);
        });
    }

    public function update(Patient $patient,array $user_data, array $patient_data): Patient
    {
        return DB::transaction(function () use ($patient,$user_data, $patient_data) {
            $patient->user()->update($user_data);
            $patient->update($patient_data);
            return $patient;
        });
    }

    public function delete(Patient $patient): bool
    {
        return DB::transaction(function () use ($patient) {
            return $patient->delete();
        });
    }

    public function find($id): ?Patient
    {
        return Patient::findOrFail($id);
    }

    public function getAll()
    {
        return Patient::all();
    }
    public function patientsForDoctor(Doctor $doctor)
    {
        return Patient::query()->where();
    }
}
