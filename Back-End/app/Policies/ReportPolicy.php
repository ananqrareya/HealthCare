<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Report;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Validation\Rule;

class ReportPolicy
{

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role_id == Role::Doctor->value;
    }


}
