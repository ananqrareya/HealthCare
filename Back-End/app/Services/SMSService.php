<?php

namespace App\Services;
use Twilio\Exceptions\ConfigurationException;
use Twilio\Exceptions\RestException;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class SMSService
{
    protected Client $client;

    /**
     * @throws ConfigurationException
     */
    public function __construct()
    {

        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        if (!$sid || !$token) {
            throw new \Exception('Twilio SID and Token must be set in the environment variables.');
        }
        $this->client = new Client($sid, $token);
    }


    /**
     * @throws TwilioException
     * @throws \Exception
     */
    public function sendSMS($to, $message): void
    {

        try {
            $response = $this->client->messages->create($to, [
                'from' => config('services.twilio.phone'),
                'body' => $message,
            ]);

        } catch (RestException $e) {

            throw new \Exception("Failed to send SMS: {$e->getMessage()}");
        }
    }


}

