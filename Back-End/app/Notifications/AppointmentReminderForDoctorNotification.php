<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentReminderForDoctorNotification extends Notification
{
    use Queueable;

    public function __construct(Public $appointment)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast', 'database'];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast($notifiable) : BroadcastMessage
    {
        $patientGender = $this->appointment->patient->gender;

        $patientTitle = $patientGender === 'male' ? 'المريض' : 'المريضة';

        return new BroadcastMessage([
            'appointment_id' => $this->appointment->id,
            'time' => $this->appointment->time,
            'message' => "{$this->appointment->doctor->user->name}، لديك موعد مع {$patientTitle} {$this->appointment->patient->user->name} في تمام الساعة {$this->appointment->time}."
        ]);
    }



    public function broadcastOn(){

        return [
            new Channel("appointment.reminder.doctor.{$this->appointment->doctor_id}"),
        ];
    }

    public function toDatabase($notifiable)
    {

        $patientGender = $this->appointment->patient->gender;

        $patientTitle = $patientGender === 'male' ? 'المريض' : 'المريضة';

        return [
            'appointment_id' => $this->appointment->id,
            'time' => $this->appointment->time,
            'message' => "{$this->appointment->doctor->user->name}، لديك موعد مع {$patientTitle} {$this->appointment->patient->user->name} في تمام الساعة {$this->appointment->time}."
        ];


    }

}
