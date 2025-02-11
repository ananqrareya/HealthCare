<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaboratoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'position' => $this->position,
            'license_number' => $this->license_number,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'full_name' => $this->user->first_name.' '.$this->user->last_name,
                'phone' => $this->user->phone,
            ] : null,
        ];
    }
}
