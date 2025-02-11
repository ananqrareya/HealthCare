<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\DoctorRating;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DoctorRatingPolicy
{

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role_id == Role::Patient->value;
    }



    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DoctorRating $doctorRating): bool
    {
        return $user->id == $doctorRating->doctor_id
            || $user->id == $doctorRating->patient_id
            ||  $user->role_id == Role::Admin->value;
    }


}
