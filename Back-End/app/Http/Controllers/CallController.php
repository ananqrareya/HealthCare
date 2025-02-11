<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Twilio\Rest\Client;
use Twilio\TwiML\VoiceResponse;
use App\Models\Transcription;

class CallController extends Controller
{
    protected $twilioClient;

    public function __construct(Client $twilioClient)
    {
        $this->twilioClient = $twilioClient;
    }

    public function handleIncomingCall(Request $request)
    {
        $response = new VoiceResponse();
        $response->say('Please leave a message after the beep.');
        $response->record([
            'transcribe' => true,
            'transcribeCallback' => route('transcription.callback')
        ]);
        $response->hangup();
        return response($response, 200)
            ->header('Content-Type', 'text/xml');
    }

    public function transcriptionCallback(Request $request)
    {
        $transcriptionText = $request->input('TranscriptionText');
        $recordingUrl = $request->input('RecordingUrl');
        $callSid = $request->input('CallSid');
        $phoneNumber = $request->input('From');
        Transcription::create([
            'call_sid' => $callSid,
            'phone_number' => $phoneNumber,
            'transcription_text' => $transcriptionText,
        ]);
        return response('OK', 200);
    }
}
