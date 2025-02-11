<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Bail;
use App\Notifications\NewAppointmentToDoctorNotification;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(public PaymentService $paymentService)
    {
    }

    public function success(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);
        $appointment->doctor->user->notify(new NewAppointmentToDoctorNotification($appointment));

        $invoice = $this->paymentService->makeInvoiceForAppointment($appointment);
        $bail = Bail::query()->create([
            'amount' => $appointment->doctor->online_fee,
            'invoice_id' => $invoice->id,
            'doctor_id' => $appointment->doctor->id,
            'patient_id' => $appointment->patient->id,
            'number' => rand(100000,500000),
            'service_details' => 'Pock Appointment',
            'date' => now()->toDateString(),
        ]);
        $appointment->bail_id = $bail->id;
        $appointment->save();

        return response()->json(['success' => 'payment process is completed '], 401);

    }

    public function cancel(Request $request, $appointmentId)
    {
        $appointment = Appointment::forceDestroy($appointmentId);

        return response()->json(['error' => 'payment process is canceled'], 401);
    }


}
