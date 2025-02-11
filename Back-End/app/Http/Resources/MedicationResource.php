<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MedicationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'dosage' => $this->dosage,
            'instructions' => $this->instructions,
            'doctor_id' => $this->doctor_id,
        ];
    }
}
