<?php

namespace App\Http\Controllers\Appointment;

use App\Events\AppointmentEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteAppointment;
use App\Http\Requests\StoreClinicAppointmentRequest;
use App\Http\Requests\StoreOnlineAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentCollection;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\HealthRecordsCollection;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Patient;
use App\Notifications\AppointmentReminderForPatientNotification;
use App\Notifications\CompleteAppointmentNotification;
use App\Notifications\MissedAppointmentNotification;
use App\Notifications\NewAppointmentToDoctorNotification;
use App\Services\AppointmentService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }
    public function storeClinicAppointment(StoreClinicAppointmentRequest $request,Clinic $clinic): JsonResponse
    {
        Gate::authorize('storeClinicAppointment',Appointment::class);


        $patient = Patient::findOrFail(Auth::id());



        if ($patient->is_blocked){
            throw new \Exception('blocked');

        }

        // Check if patient already has a booking at the same time
        $existingAppointment = Appointment::where('patient_id', Auth::id())
            ->where('date', $request->date)
            ->where('time', $request->time)
            ->where('status','!=', 'cancelled')
            ->first();
        if ($existingAppointment) {
            response()->json([
                'error'=>'You already have an appointment at this time.'
            ]);
        }

        $data = $request->validated();


        $data['visit_type'] = 'locale';
        $data['status'] = 'pending';
        $data['clinic_id']=$clinic->id;
        $data['doctor_id']=$clinic->doctor->id;

        $appointment = $this->appointmentService->clinicStore($data, $clinic);

        $appointment->doctor->user->notify(new NewAppointmentToDoctorNotification($appointment));

        return response()->json([
            'success' => true,
            'appointment' => new AppointmentResource($appointment),
        ], 201);
    }
    public function storeOnlineAppointment(StoreOnlineAppointmentRequest $request, Doctor $doctor): JsonResponse
    {
        Gate::authorize('storeOnlineAppointment',Appointment::class);


        $data = $request->validated();
        $data['visit_type'] = 'online';
        $data['status'] = 'pending';


        if (!$doctor->online_active) {
            return response()->json([
                'error' => 'This doctor does not have online appointments available.',
            ], 400);
        }
        $user = \App\Models\User::query()->findOrFail(Auth::id());


        if ($user->patient->is_blocked){
            throw new \Exception('blocked');

        }

        $appointment = $this->appointmentService->onlineStore($data, $doctor,$user->patient);


        try {
            $user->createOrGetStripeCustomer();

            $session = $user->checkout([
                [
                    'price_data' => [
                        'currency' => 'ils',
                        'product_data' => [
                            'name' => "موعد مع الدكتور {$appointment->doctor->user->name}",
                            'description' => "🗓 التاريخ: " . Carbon::parse($appointment->date)->format('F j, Y') .
                                "\n⏰ الوقت: " . Carbon::parse($appointment->time)->format('g:i A'),
                            'images' => [
                                $doctor->user->avatar,
                            ],
                            'metadata' => [
                                'appointment_id' => (string) $appointment->id,
                                'patient_name' => $appointment->patient->user->name,
                                'doctor_name' => $appointment->doctor->user->name,
                                'appointment_date' => Carbon::parse($appointment->date)->toDateString(),
                                'appointment_time' => Carbon::parse($appointment->time)->toTimeString(),
                            ],
                        ],
                        'unit_amount' => intval($appointment->doctor->online_fee * 100), // Ensure the amount is an integer
                    ],
                    'quantity' => 1,
                ]
            ], [

                'success_url' => 'http://localhost:5174/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5174/cancel',
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe Checkout Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while processing the payment. Please try again.',
            ], 500);
        }
        return response()->json([
            'success' => true,
            'url'=>$session->url,
            'appointment_id' => $appointment->id,
        ]);
    }
    public function markMissed(Appointment $appointment)
    {
        $patient = $appointment->patient;
        $patient->user->notify(new MissedAppointmentNotification($appointment, $patient->missed_appointments));

        Gate::authorize('markMissed',[Appointment::class, $appointment]);

        if ($appointment->status != 'pending') {
            return response()->json(['message' => 'Invalid appointment status for marking as missed.'], 400);
        }
        $patient = $appointment->patient;

        DB::transaction(function () use ($appointment) {
            $appointment->update(['status' => 'missed']);
            $patient = $appointment->patient;

            if ($patient) {
                $patient->increment('missed_appointments');

                if ($patient->missed_appointments >= 3) {
                    $patient->update([
                        'is_blocked' => true,
                        'blocked_until' => now()->addMonth(),
                    ]);
                }
            }
            $patient->user->notify(new MissedAppointmentNotification($appointment, $patient->missed_appointments));
        });


        return response()->json(['message' => 'Appointment marked as missed and patient status updated.'], 200);


    }
    public function markComplete(CompleteAppointment $request, Appointment $appointment)
    {
        Gate::authorize('markComplete', [Appointment::class, $appointment]);
        $appointment->patient->user->notify(new CompleteAppointmentNotification($appointment));

        $this->appointmentService->markComplete($appointment, $request);
        return response()->json(['message' => 'Appointment marked as completed successfully.']);
    }


    public function markCancel(Appointment $appointment)
    {
        Gate::authorize('markCancel',[Appointment::class, $appointment]);

        if ($appointment->status === 'cancel') {
            return response()->json(['message' => 'Appointment is already cancelled.'], 200);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled successfully.'], 200);
    }


    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        Gate::authorize('update',[Appointment::class, $appointment]);
        $data = $request->validated();
        $appointment = $this->appointmentService->update($appointment, $data);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'data' => new AppointmentResource($appointment),
        ], 200);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        Gate::authorize('view',[Appointment::class, $appointment]);


        return response()->json([
            'data' => new AppointmentResource($appointment)
        ], 200);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        Gate::authorize('delete',[Appointment::class, $appointment]);
        $this->appointmentService->delete($appointment);

        return response()->json([
            'message' => 'Appointment deleted successfully'
        ], 200);
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny',Appointment::class);

        $appointments = $this->appointmentService->getAll();

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }
    public function getAppointmentsByDoctor(Doctor $doctor): JsonResponse
    {
        Gate::authorize('viewAnyForDoctor',Appointment::class);


        $appointments = $this->appointmentService->getByDoctor($doctor->id);

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }
    public function getLocalAppointmentsByDoctor(Doctor $doctor): JsonResponse
    {
        Gate::authorize('viewAnyForDoctor',Appointment::class);


        $appointments = $this->appointmentService->getLocalByDoctor($doctor->id);

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }




    public function allClinicAppointment(Clinic $clinic): JsonResponse
    {
        Gate::authorize('viewAnyForClinic',Appointment::class);


        $appointments = $this->appointmentService->getLocalByClinic($clinic);

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }
    public function getOnlineAppointmentsByDoctor(Doctor $doctor): JsonResponse
    {
        Gate::authorize('viewAnyForDoctor',Appointment::class);


        $appointments = $this->appointmentService->getOnlineByDoctor($doctor->id);

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }
    public function getReservedAppointmentsByDoctor(Doctor $doctor): \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $appointments = $this->appointmentService->ReservedAppointmentsTimeForDoctor($doctor->id);


        return response($appointments)->setStatusCode(200);
    }
    public function getReservedAppointmentsByClinic(Clinic $clinic): \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $appointments = $this->appointmentService->ReservedAppointmentsTimeForClinic($clinic->id);


        return response($appointments)->setStatusCode(200);
    }
    public function getAppointmentsByPatient(Patient $patient): JsonResponse
    {

        Gate::authorize('viewAnyForPatient',Appointment::class);

        $appointments = $this->appointmentService->getByPatient($patient->id);

        return (new HealthRecordsCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }

    public function getAppointmentsByPatientForDoctor(Patient $patient): JsonResponse
    {

        Gate::authorize('viewAnyForPatientForDoctor',Appointment::class);

        $appointments = $this->appointmentService->getByPatientForDoctor($patient->id);

        return (new HealthRecordsCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }



    public function shiftOnlineAppointment(): JsonResponse
    {
        Gate::authorize('shift',Appointment::class);
        $doctor =   auth()->user()->doctor;
        $this->appointmentService->shiftOnlinePendingByDoctorToday($doctor->id, $doctor->onlinne_appointment_time);

        return response()
            ->json([
                'success' => true,
                'message' => 'Appointments shifted successfully',
            ])
            ->setStatusCode(200);
    }


    public function shiftLocalAppointment(): JsonResponse
    {
        Gate::authorize('shift',Appointment::class);
        $doctor =   auth()->user()->doctor;

        $appointments = $this->appointmentService->shiftLocalPendingByDoctorToday($doctor->id,$doctor->appointment_time);

        return (new AppointmentCollection($appointments))
            ->response()
            ->setStatusCode(200);
    }

}
