<?php

namespace App\Http\Resources;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
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
            'id' => $this?->id,
            'id_number' => $this?->id_number,
            'gender' => $this?->gender,
            'blood_type' => $this?->blood_type,
            'emergency_contact_name' => $this?->emergency_contact_name,
            'emergency_contact_phone' => $this?->emergency_contact_phone,
            'created_at' => $this?->created_at,
            'updated_at' => $this?->updated_at,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
                'role' => Role::getNameById(intval($user->role_id)),
                'dob'=>$user->dob,
                'avatar' => $user->avatar,


            ],
        ];  
    }
}
