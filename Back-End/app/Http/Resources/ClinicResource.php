<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $user=$this->doctor->user;
        return [
            'id' => $this->id,
            'ar_name' => $this->ar_name,
            'en_name' => $this->en_name,
            'lat'=>$this->lat,
            'long'=>$this->long,
            'clinic_phone'=>$this->clinic_phone,
            'licence_number'=>$this->clinic_id,
            'city' => [
                'id'=>$this->city->id,
                'ar_name'=>$this->city->ar_name,
                'en_name'=>$this->city->en_name,
            ],
            'address' => json_decode($this->address),
            'appointment_time'=>$this->appointment_time,
            'specialist' => [
                'id'=> $this->specialist->id,
                'ar_name'=>$this->specialist->ar_name,
                'en_name'=>$this->specialist->en_name,
            ],
            'doctor' => [
                'id' => $this->doctor->id,
                'id_number' => $this->doctor->id_number,
                'ar_full_name' => $user->first_name.' '.$user->last_name,
                'en_full_name' => $user->en_first_name.' '.$user->en_last_name,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
            ],
            'schedule' => new scheduleCollection($this->clinic_schedule),



        ];
    }
}
