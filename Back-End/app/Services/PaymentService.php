<?php

namespace App\Services;

use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Exception\ApiErrorException;

class PaymentService
{

    public function makeInvoiceForAppointment($appointment)
    {
        $user = $appointment->patient->user;

        try {
            $user->createOrGetStripeCustomer();

            if ($user->stripe_id) {
                $stripe = new \Stripe\StripeClient('sk_test_51QenTXJ5NM97aWqMNOgpie7bokjt99oWGK7lbafATWf23N8eehljauYLFB9qvqS1nbnzy6soiKS9s2bf8KhYiRq800xs9LQTtq');

                // Retrieve the customer
                $customer = $stripe->customers->retrieve($user->stripe_id);

                // Create an invoice item
                $stripe->invoiceItems->create([
                    'customer' => $user->stripe_id,
                    'amount' => $appointment->doctor->online_fee * 100,
                    'currency' => 'ils',
                ]);


                // Create the invoice
                $invoice = $stripe->invoices->create([
                    'customer' => $user->stripe_id,
                    'collection_method' => 'charge_automatically',
                    'pending_invoice_items_behavior' => 'include',
                    'currency' => 'ils',
                ]);


                return $invoice;
            } else {
                return response()->json([
                    'error' => 'User is not configured for Stripe billing.'
                ], 400);
            }
        } catch (\Stripe\Exception\CardException $e) {
            return response()->json(['error' => 'Payment failed: ' . $e->getMessage()], 400);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json(['error' => 'Stripe API error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

}
