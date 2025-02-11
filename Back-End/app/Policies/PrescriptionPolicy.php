<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PrescriptionPolicy
{



    public function create(User $user): bool
    {
        return $user->role_id == Role::Doctor->value;
    }


}
