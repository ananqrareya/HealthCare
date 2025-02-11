<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class AppointmentReminderForPatientNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $appointment;

    public function __construct($appointment)
    {
        $this->appointment = $appointment;
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
    public function toBroadcast($notifiable): BroadcastMessage
    {
        $genderedGreeting = $this->appointment->patient->gender === 'female'
            ? "عزيزتي"
            : "عزيزي";

        return new BroadcastMessage([
            'appointment_id' => $this->appointment->id,
            'time' => $this->appointment->time,
            'message' => "$genderedGreeting {$notifiable->name}، لديك موعد في تمام الساعة {$this->appointment->time}. نتمنى لك دوام الصحة والعافية."
        ]);
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'patient_id' => $this->appointment->patient->id,
            'time' => $this->appointment->time,
            'message' => "{$this->appointment->time} لديك موعد."
        ];
    }

    public function broadcastOn()
    {
        return [
            new Channel("appointment.reminder.{$this->appointment->patient->id}"),
        ];
    }
}
