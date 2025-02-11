<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DoctorPolicy
{


    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role_id == Role::Admin->value;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Doctor $doctor): bool
    {


        return $user->role_id == Role::Admin->value || $user->role_id == Role::Doctor->value;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Doctor $doctor): bool
    {
        return $user->role_id == Role::Admin->value;
    }



}
