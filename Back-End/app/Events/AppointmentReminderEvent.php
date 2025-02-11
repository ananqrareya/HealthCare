<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentReminderEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private Appointment $appointment;

    /**
     * Create a new event instance.
     */
    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Get the data to broadcast with the event.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $genderedGreeting = $this->appointment->patient->gender === 'female'
            ? "عزيزتي"
            : "عزيزي";

        return [
            'appointment_id' => $this->appointment->id,
            'time' => $this->appointment->time->format('H:i'), // Ensure proper time formatting
            'message' => "$genderedGreeting {$this->appointment->patient->name}، لديك موعد في تمام الساعة {$this->appointment->time->format('H:i')}. نتمنى لك دوام الصحة والعافية.",
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("appointment.reminder.{$this->appointment->patient->id}"),
        ];
    }

    /**
     * Define the event name to broadcast as.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'appointment-reminder';
    }
}
