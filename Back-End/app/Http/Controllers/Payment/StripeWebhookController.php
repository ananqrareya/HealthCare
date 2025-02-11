<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();

        if ($payload['type'] === 'checkout.session.completed') {
            $session = $payload['data']['object'];

            // Retrieve the appointment and user
            $appointmentId = $session['metadata']['appointment_id'];
            $appointment = Appointment::find($appointmentId);

            // Generate Invoice
            $stripe = new StripeClient(env('STRIPE_SECRET'));
            $invoice = $stripe->invoices->create([
                'customer' => $session['customer'],
                'auto_advance' => true, // Automatically finalize the invoice
            ]);

            // Save invoice details to your database
            $appointment->update([
                'invoice_id' => '22'
            ]);
        }

        return response()->json(['status' => 'success','invoice_id' => $invoice->id]);
    }

}
