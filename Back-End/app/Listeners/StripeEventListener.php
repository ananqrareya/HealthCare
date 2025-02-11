<?php

namespace App\Listeners;

use App\Models\Appointment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\StripeClient;

class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle received Stripe webhooks.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {


            if ($event->payload['type'] === 'checkout.session.completed') {
                $session = $event->payload['data']['object'];

                // Retrieve the appointment and user
                $appointmentId = $session['metadata']['appointment_id'];
                $appointment = Appointment::find($appointmentId);

                // Generate Invoice
//                $stripe = new StripeClient(env(''));
//                $invoice = $stripe->invoices->create([
//                    'customer' => $session['customer'],
//                    'auto_advance' => true, // Automatically finalize the invoice
//                ]);

                // Save invoice details to your database
                $appointment->update([
                    'invoice_id' => '22',
                ]);
            }
        }
    }
}

