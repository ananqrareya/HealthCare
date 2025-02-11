<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class CompleteAppointmentNotification extends Notification
{
    use Queueable;

    protected $appointment;

    /**
     * Create a new notification instance.
     */
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
        return new BroadcastMessage($this->notificationData($notifiable));
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->notificationData($notifiable);
    }

    /**
     * Define the notification data structure (used for both broadcast and database).
     */
    private function notificationData($notifiable): array
    {
        $genderedGreeting = $this->appointment->patient->gender === 'female'
            ? "عزيزتي"
            : "عزيزي";

        $humorousNote = $this->appointment->patient->gender === 'female'
            ? "ولا تنسي أن تقييمك يجعل يومنا أجمل!"
            : "ولا تنسا أن تقييمك يجعل يومنا أجمل!";

        return [
            'appointment_id' => $this->appointment->id,
            'doctor_name' => $this->appointment->doctor->user->name,
            'doctor_id' => $this->appointment->doctor->id,
            'patient_id' => $this->appointment->patient->id,
            'message' => "$genderedGreeting {$notifiable->name}، شكرًا لالتزامك بموعدك. نرجو منك تقييم خدمتنا. $humorousNote نتمنى لك دوام الصحة والعافية."
        ];
    }

    public function broadcastOn()
    {
        return [
            new Channel("appointment.rating.{$this->appointment->patient->id}"),
        ];
    }
}
