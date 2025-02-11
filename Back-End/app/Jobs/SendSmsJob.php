<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Twilio\Exceptions\ConfigurationException;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class SendSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $phone;
    protected string $message;
    protected Client $client;

    /**
     * @throws ConfigurationException
     */
    public function __construct(string $phone, string $message)
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        if (!$sid || !$token) {
            throw new \Exception('Twilio SID and Token must be set in the environment variables.');
        }
        $this->client = new Client($sid, $token);
        $this->phone = $phone;
        $this->message = $message;
    }

    /**
     * @throws TwilioException
     */
    public function handle(): void
    {
        $this->client->messages->create($this->phone, [
            'from' =>  config('services.twilio.phone'),
            'body' => $this->message
        ]);
    }
}
