<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(protected Message $message)
    {

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        return [
            new PresenceChannel('doctor.message.' . $this->message->recipient->id),
        ];
    }

    public function broadcastAs()
    {
        return 'New Message';
    }

    public function broadcastWith()
    {
        return [
            'sender' => [
                'id' => $this->message->sender_id,
                'name' => $this->message->sender->name,
                'user_image'=>$this->message->sender->avatar
            ],
            'body'=> $this->message->body,
            'sent_at'=>$this->message->sent_at,

        ];
    }
}
