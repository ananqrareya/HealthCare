<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\City;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CityPolicy
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
    public function update(User $user, City $city): bool
    {
        return $user->role_id == Role::Admin->value;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, City $city): bool
    {
        return $user->role_id == Role::Admin->value;
    }


}
