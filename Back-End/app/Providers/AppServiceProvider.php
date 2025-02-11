<?php

namespace App\Providers;

use App\Enums\Role;
use App\Http\Controllers\Doctor\ReportController;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Report;
use App\Models\User;
use App\Policies\AppointmentPolicy;
use App\Policies\DoctorPolicy;
use App\Policies\ReportPolicy;
use App\Policies\UserPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */

    public function register(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Appointment::class, AppointmentPolicy::class);
        Gate::policy(Doctor::class, DoctorPolicy::class);
        Gate::policy(Report::class, ReportPolicy::class);


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-doctor-dashboard', function (User $user) {
            return $user->role_id == Role::Doctor->value;
        });
        Gate::define('view-admin-dashboard', function (User $user) {
            return $user->role_id == Role::Admin->value;
        });

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
