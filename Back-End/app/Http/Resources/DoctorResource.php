<?php

namespace App\Http\Resources;

use App\Enums\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user= $this->user;

        return [
            'id' => $this->id,
            'id_number' => $this->id_number,
            'online_active' => $this->online_active,
            'speciality' => $this->speciality,
            'available' => $this->available,
            'about' => $this->about,
            'fee'=>$this->fee,
            'online_fee'=>$this->online_fee,
            'ar_full_name' => $user->first_name.' '.$user->last_name,
            'en_full_name' => $user->en_first_name.' '.$user->en_last_name,
            'phone' => $user->phone,
            'avatar' => $user->avatar,
            'rating'=>$this->rating,
            'is_active'=>$this->user->is_active,
            'online_appointment_time'=>$this->online_appointment_time,

        ];

    }
}


