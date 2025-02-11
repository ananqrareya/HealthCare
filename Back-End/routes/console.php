<?php

use App\Models\Patient;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    Patient::query()->where('is_blocked', true)
        ->where('blocked_until', '<=', now())
        ->update(['is_blocked' => false, 'missed_appointments' => 0]);
})->daily();



Schedule::job(\App\Jobs\CancelUnfinishedAppointments::class)->everyMinute();
Schedule::command('appointments:send-reminders')->everyMinute();

