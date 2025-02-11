<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Notifications\AppointmentReminderForDoctorNotification;
use App\Notifications\AppointmentReminderForPatientNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders to patients 2 hours before their appointments';

    /**
     * Execute the console command.
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $twoHoursFromNow = Carbon::now(+2)->addHours(2);

        $appointments_for_patient = Appointment::query()
            ->where('reminder_sent', false)
            ->where('time', '<=', $twoHoursFromNow->format('H:i'))
            ->whereDate('date', '=',  Carbon::now('Asia/Gaza')->format('Y-m-d'))
            ->get();

        $this->info("patient appoinntment : $appointments_for_patient");

        foreach ($appointments_for_patient as $appointment) {
            $appointment->patient->user->notify(new AppointmentReminderForPatientNotification($appointment));
            $appointment->reminder_sent = true;
            $appointment->save();
        }

        $add5MinutesForNow = Carbon::now('Asia/Gaza')->addMinutes(5)->format('H:i');

        $appointments_for_doctor = Appointment::query()
            ->where('reminder_sent_to_doctor', false)
            ->whereDate('date', '=',  Carbon::now('Asia/Gaza')->format('Y-m-d'))
            ->whereTime('time', '<=', $add5MinutesForNow)
            ->whereTime('time', '>=', Carbon::now('Asia/Gaza')->format('H:i'))
            ->get();
        $this->info("doctor appoinntment : $appointments_for_doctor");

        foreach ($appointments_for_doctor as $appointment) {
            $appointment->doctor->user->notify(new AppointmentReminderForDoctorNotification($appointment));
            $appointment->reminder_sent_to_doctor = true;
            $appointment->save();
        }


        $this->info('Reminders sent successfully!');
    }
}
