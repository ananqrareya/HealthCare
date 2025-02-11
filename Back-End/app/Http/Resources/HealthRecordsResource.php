<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthRecordsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Check if the route matches the doctor's appointments endpoint
        $isDoctorSpecificRoute = $request->route()->named('doctor.appointments');
        return [
            'id' => $this->id,
            'date' => $this->date,
            'status'=>$this->status,
            'time' => $this->time,
            'visit_type' => $this->visit_type,
            'clinic_name'=> $this?->clinic?->ar_name,
            'report'=>$this?->report?->file_path,
            'prescription'=>$this?->prescription?->file_path,
            'another_files'=>json_decode($this?->another_files),
            'patient_note'=>json_decode($this?->patient_note),
            'quick_note'=>json_decode($this?->quick_note),
            'appointment_note'=>json_decode($this?->appointment_note),
            'doctor'=>[
                'id'=>$this->doctor_id,
                'avatar'=>$this->doctor->user->avatar,
                'ar_full_name'=>$this->doctor->user->name,
                'speciality'=>$this->doctor->speciality,
            ]
        ];
    }
}
