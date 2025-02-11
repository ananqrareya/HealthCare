<?php
namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewAppointmentToDoctorNotification extends Notification implements ShouldQueue
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
        return ['broadcast', 'database']; // Added database channel
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->notificationData());
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase($notifiable): array
    {
        return $this->notificationData();
    }

    /**
     * Prepare the notification data.
     */
    protected function notificationData(): array
    {
        $date = Carbon::make($this->appointment->date)->format("Y-m-d");
        return [
            'appointment_id' => $this->appointment->id,
            'time' => $this->appointment->time,
            'doctor_id' => $this->appointment->doctor_id,
            'patient_id' => $this->appointment->patient_id,
            'message' => "لقد تم حجز موعد جديد بواسطة {$this->appointment->patient->user->name} بتاريخ {$date} في تمام الساعة {$this->appointment->time}"
        ];
    }

    /**
     * Define the broadcast channel.
     */
    public function broadcastOn()
    {
        return [
            new Channel("appointment.to.doctor.{$this->appointment->doctor_id}"),
        ];
    }
}
