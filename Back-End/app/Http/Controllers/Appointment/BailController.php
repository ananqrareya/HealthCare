<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Bail;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;

class BailController extends Controller
{
    public function getInvoiceAsPdf(Request $request, Bail $bail)
    {


        $user = $bail->patient->user;
        $appointment = $bail->appointment;
        $invoiceId = $bail->invoice_id;

        $local_appointment_data = [
            'vendor' => 'HealthCare',
            'phone' => 'Phone: ' . $appointment->doctor->user->phone,
            'email' => 'Patient Name: ' . $appointment->patient->user->en_name,
            'vendorVat' => 'Doctor Name: ' . $appointment->doctor->user->en_name,
            'street' => 'Clinic Name: ' . $appointment?->clinic?->en_name,
            'location' => 'Clinic Address: ' . $appointment?->clinic?->address,
        ];
        $online_appointment_data = [
            'vendor' => 'HealthCare',
            'phone' => 'Phone: ' . $appointment->doctor->user->phone,
            'email' => 'Patient Name: ' . $appointment->patient->user->en_name,
            'vendorVat' => 'Doctor Name: ' . $appointment->doctor->user->en_name,
        ];
        return $user->downloadInvoice($invoiceId,
            $appointment->visit_type == 'local'
                ? $local_appointment_data
                : $online_appointment_data
        );
    }

    public function getPatientBails(Request $request, Patient $patient): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return $patient->bails()->paginate(8);
    }

    public function getDoctorBails(Request $request, Doctor $doctor, Patient $patient): \Illuminate\Database\Eloquent\Collection
    {
        return $doctor->bails()->where('patient_id', '=', $patient->id)->get([
            'id',
            'invoice_id',
            'amount',
            'service_details',
            'date',
        ]);
    }

}
