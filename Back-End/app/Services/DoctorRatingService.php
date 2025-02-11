<?php

namespace App\Services;

use App\Models\DoctorRating;
use Illuminate\Support\Facades\DB;

class DoctorRatingService
{
    public function store(array $data): DoctorRating
    {
        return DB::transaction(function () use ($data) {
            return DoctorRating::create($data);
        });
    }






    public function getAllByDoctor($doctorId)
    {
        return DoctorRating::with(['doctor', 'patient'])
            ->where('doctor_id', $doctorId)
            ->where('is_deleted', '=',false)
            ->get();
    }
}
