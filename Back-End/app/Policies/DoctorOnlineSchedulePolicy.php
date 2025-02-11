<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;

class DoctorOnlineSchedulePolicy
{
    public function update(User $user, Doctor $doctor): bool
    {
        return $user->id == $doctor->id;
    }


    public function toggleStatus(User $user,  $doctorId): bool
    {
        return $user->id == $doctorId;
    }



}
