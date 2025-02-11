<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorRatingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $doctor = $this->doctor;
        $patient = $this->patient;
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'review' => $this->review,
            'created_at' => $this->created_at,
            'doctor' => [
                'id' => $doctor->id,
                'ar_full_name' => $doctor->user->first_name . ' ' . $doctor->user->last_name,
                'en_full_name' => $doctor->user->en_first_name . ' ' . $doctor->user->en_last_name,
                'avatar' => $doctor->user->avatar,
            ], 'patient' => [
                'id' => $patient->id,
                'ar_full_name' => $patient->user->first_name . ' ' . $patient->user->last_name,
                'en_full_name' => $patient->user->en_first_name . ' ' . $patient->user->en_last_name,
                'avatar' => $patient->user->avatar,
            ],

        ];
    }
}
