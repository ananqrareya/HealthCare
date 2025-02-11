<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class MissedAppointmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $appointment, protected $missedCount)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast', 'database']; // Add database channel
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
    public function toDatabase($notifiable): array
    {
        return $this->notificationData($notifiable);
    }

    /**
     * Prepare the notification data.
     */
    protected function notificationData($notifiable): array
    {
        $genderedGreeting = $this->appointment->patient->gender === 'female'
            ? "عزيزتي"
            : "عزيزي";

        $warningMessage = $this->missedCount >= 3
            ? "يرجى ملاحظة أن حسابك قد تم حظره لمدة شهر بسبب تكرار الغياب."
            : "لديك الآن {$this->missedCount} إنذارات بسبب عدم الحضور. عند الوصول إلى 3 إنذارات سيتم حظر حسابك لمدة شهر.";

        return [
            'appointment_id' => $this->appointment->id,
            'doctor_name' => $this->appointment->doctor->user->name,
            'doctor_id' => $this->appointment->doctor_id,
            'patient_id' => $this->appointment->patient_id,
            'message' => "$genderedGreeting {$notifiable->name}، نود إبلاغك بأنه تم تسجيل غيابك عن موعدك بتاريخ {$this->appointment->date->format('Y-m-d')}. $warningMessage نتمنى لك دوام الصحة والعافية."
        ];
    }

    /**
     * Define the broadcast channel.
     */
    public function broadcastOn()
    {
        return [
            new Channel("appointment.missing.patient.{$this->appointment->patient->id}"),
        ];
    }
}
