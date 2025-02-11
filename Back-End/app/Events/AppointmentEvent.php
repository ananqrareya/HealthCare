<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentEvent implements ShouldBroadcast
{

    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(Private $appointment)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('appointments.doctor.'.$this->appointment->doctor->id),
        ];
    }

    public function broadcastWith(): array
    {
        $en_full_name = $this->appointment->patient->user->name;

        return [

            'message' => "A new appointment has been booked by $en_full_name"
            ,
            'appointment_id' => $this->appointment->id,
            'patient_name' => $this->appointment->patient->user->en_full_name,
            'appointment_time' => $this->appointment->time,
            'appointment_date' => $this->appointment->dated,
        ];
    }
}
