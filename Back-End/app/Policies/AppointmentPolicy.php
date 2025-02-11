<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role_id == Role::Admin->value;
    }

    public function storeClinicAppointment(User $user): bool
    {
        return $user->role_id == Role::Patient->value ;
    }
    public function storeOnlineAppointment(User $user): bool
    {
        return $user->role_id == Role::Patient->value ;
    }


    // the father in the
    public function viewAnyForDoctor(User $user): bool
    {
        return $user->role_id == Role::Doctor->value ;
    }

    public function markComplete(User $user,  Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id ;
    }
    public function markCancel(User $user,  Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id || $user->id == $appointment->patient_id ;
    }
    public function viewAnyForClinic(User $user): bool
    {
        return $user->role_id == Role::Doctor->value   ;
    }
    public function viewAnyForPatientForDoctor(User $user): bool
    {
        return $user->role_id == Role::Doctor->value   ;
    }


    public function markMissed(User $user,  Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id ;
    }


    public function viewAnyForPatient(User $user): bool
    {
        return $user->role_id == Role::Patient->value ;
    }



    /**
     * Determine whether the user can view the model.
     */

    public function view(User $user, Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id || $user->id == $appointment->patient_id;
    }



    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id;
    }

    public function shift(User $user): bool
    {
        return $user->role_id == Role::Doctor->value;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->id == $appointment->doctor_id;
    }


}
