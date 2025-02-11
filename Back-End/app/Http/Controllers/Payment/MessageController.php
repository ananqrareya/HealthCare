<?php

namespace App\Http\Controllers\Payment;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Message;
use Illuminate\Http\Request;


class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        return Message::with('sender:id,first_name,last_name')
            ->with('recipient')
            ->latest()
            ->paginate($request->per_page ?? 10,'*','messages',$request->page ?? 1);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):Message
    {
        $doctor = Doctor::query()->findOrFail($request->recipient_id);
        $request->validate([
            'body'=>['required','string'],
        ]);

        $message=$doctor->receivedMessages()->create([
            'body'=>$request->post('body'),
            'sender_id'=>$request->post('sender_id'),
        ]);

        MessageSent::broadcast($message)->toOthers();

        return $message->load('sender:id,first_name,last_name');
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor,Message $message)
    {
        return $message;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor,Message $message)
    {

        $request->validate([
            'body'=>['required','string'],
        ]);

        $message->update([
            'body'=>$request->post('body'),
        ]);
        return $message;

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $message->delete();
        return [];
    }

    public function chat(Doctor $doctor)
    {
        return $doctor
            ->receivedMessages()
            ->with('sender:id,first_name,last_name')
            ->latest()
            ->get();

    }
}
