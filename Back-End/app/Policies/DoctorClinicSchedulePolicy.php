<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;

class DoctorClinicSchedulePolicy
{


    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Doctor $doctor): bool
    {
        return $user->id == $doctor->id;
    }


}
