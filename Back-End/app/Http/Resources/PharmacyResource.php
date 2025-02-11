<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
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
            'ar_name' => $this->ar_name,
            'en_name'=>$this->en_name,
            'city'=>$this->city?->ar_name,
            'address' => $this->address,
            'license_number' => $this->license_number,
            'pharmacy_phone'=>$this->pharmacy_phone,
            'user' => $this->user,

        ];
    }
}
