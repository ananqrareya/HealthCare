<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'time' => $this->time,
            'visit_type' => $this->visit_type,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            $this->mergeWhen(!$isDoctorSpecificRoute, [
                'doctor' => new DoctorResource($this->doctor),
            ]),
            'patient' => new PatientResource($this->patient),
            'clinic' => new ClinicResource($this->clinic),

        ];
    }
}
