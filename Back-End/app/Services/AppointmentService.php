<?php

namespace App\Services;

use App\Http\Requests\CompleteAppointment;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\Report;
use App\Notifications\CompleteAppointmentNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AppointmentService
{


    public function clinicStore(array $data, $clinic): JsonResponse|Appointment
    {
        $patient = Auth::user();
        // Prevent blocked patients from booking
        if ($patient->is_blocked && $patient->blocked_until > now()) {
            throw new \Exception('blocked');
        }

        // Check if an appointment already exists for the given date and time
        $existAppointment = Appointment::query()
            ->where('date', '=', $data['date'])
            ->where('time', '=', $data['time'])
            ->where('status','!=', 'cancelled')
            ->where('clinic_id', '=', $clinic->id)
            ->first();

        if ($existAppointment) {
            throw new \Exception('This appointment already exists.');
        }


        // Check if an appointment already exists for the given date and time
        $existAppointment = Appointment::query()
            ->where('date', '=', $data['date'])
            ->where('time', '=', $data['time'])
            ->where('status','!=', 'cancelled')
            ->where('patient_id', '=', Auth::id())
            ->first();

        if ($existAppointment) {
            throw new \Exception('You have appointment in another clinic');
        }


        // Check if the clinic is active on the given day and time

        $day = ucfirst(Carbon::parse($data['date'])->format('l'));
        $clinicSchedule = $clinic->clinic_schedule()
            ->where('day', '=', $day)
            ->where('start_time', '<=', $data['time'])
            ->where('end_time', '>=', Carbon::parse($data['time'])->addMinutes($clinic->appointment_time))
            ->where('available', '=', true)
            ->first();


        if (!$clinicSchedule) {
            throw new \Exception('The clinic is not available at the specified time.');
        }


        $checkAppointmentsInThisDay = Appointment::query()
            ->where('clinic_id', '=', $clinic->id)
            ->where('date', '=', $data['date'])
            ->where('patient_id', '=', Auth::id())
            ->where('status','!=', 'cancelled')
            ->first();

        if ($checkAppointmentsInThisDay) {
            throw new \Exception('exist');

        }


        // Ensure the appointment time aligns with the clinic's time slots

        $appointmentDuration = $clinic->appointment_time;
        $clinicStartTime = Carbon::parse($clinicSchedule->start_time);
        $clinicEndTime = Carbon::parse($clinicSchedule->end_time);
        $appointmentTime = Carbon::parse($data['time']);

        if ($appointmentTime->diffInMinutes($clinicStartTime) % $appointmentDuration !== 0) {
            throw new \Exception('Appointment time must align with the clinic time slots.');
        }


        if ($appointmentTime->lt($clinicStartTime) || $appointmentTime->gte($clinicEndTime)) {
            throw new \Exception('Appointment time is outside the clinics operating hours.');
        }

        $data['patient_id'] = Auth::id();
        $data['clinic_id'] = $clinic->id;

        // If all checks pass, create the appointment
        return Appointment::create($data);
    }


    public function onlineStore(array $data, Doctor $doctor, Patient $patient): Appointment
    {


        // Prevent blocked patients from booking
        if ($patient->is_blocked && $patient->blocked_until > now()) {
            throw new \Exception('blocked');
        }

        // Check if an appointment already exists for the given date and time
        $existAppointment = Appointment::query()
            ->where('date', '=', $data['date'])
            ->where('time', '=', $data['time'])
            ->where('patient_id', '=', Auth::id())
            ->first();

        if ($existAppointment) {
            throw new \Exception('You have appointment in another doctor');
        }

        $existAppointmentInDoctor = Appointment::query()
            ->where('date', '=', $data['date'])
            ->where('time', '=', $data['time'])
            ->where('doctor_id', '=', $doctor->id)
            ->first();

        if ($existAppointmentInDoctor) {
            throw new \Exception('This appointment already exists.');
        }


        // Check if the clinic is active on the given day and time

        $day = ucfirst(Carbon::parse($data['date'])->format('l'));
        $onlineDoctorSchedule = $doctor->online_schedule()
            ->where('day', '=', $day)
            ->where('start_time', '<=', $data['time'])
            ->where('end_time', '>=', Carbon::parse($data['time'])->addMinutes($doctor->online_appointment_time))
            ->where('available', '=', true)
            ->first();


        if (!$onlineDoctorSchedule) {
            throw new \Exception('The doctor is not available at the specified time.');
        }
        $checkAppointmentsInThisDay = Appointment::query()
            ->where('doctor_id', '=', $doctor->id)
            ->where('date', '=', $data['date'])
            ->where('patient_id', '=', $patient->id)
            ->where('status','!=', 'cancelled')
            ->first();


        if ($checkAppointmentsInThisDay) {
            throw new \Exception('exist');

        };
        // Ensure the appointment time aligns with the clinic's time slots

        $appointmentDuration = $doctor->online_appointment_time;
        $onlineStartTime = Carbon::parse($onlineDoctorSchedule->start_time);
        $onlineEndTime = Carbon::parse($onlineDoctorSchedule->end_time);
        $appointmentTime = Carbon::parse($data['time']);

        if ($appointmentTime->diffInMinutes($onlineStartTime) % $appointmentDuration !== 0) {
            throw new \Exception('Appointment time must align with the doctor time slots.');
        }


        if ($appointmentTime->lt($onlineStartTime) || $appointmentTime->gte($onlineEndTime)) {
            throw new \Exception('Appointment time is outside the doctor operating hours.');
        }


        $data['patient_id'] = $patient->id;
        $data['doctor_id'] = $doctor->id;


        // If all checks pass, create the appointment
        return Appointment::create($data);
    }


    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);
        return $appointment;
    }

    public function find($id): ?Appointment
    {
        return Appointment::findOrFail($id);
    }

    public function delete(Appointment $appointment): bool
    {
        return $appointment->delete();
    }

    public function getAll()
    {
        return Appointment::latest()->get();
    }

    public function getByDoctor($doctorId)
    {
        return Appointment::where('doctor_id', $doctorId)->latest()->get();
    }

    public function getOnlineByDoctor($doctorId)
    {
        return Appointment::where('doctor_id', $doctorId)->where('visit_type', 'online')->latest()->get();
    }

    public function getLocalByDoctor($doctorId)
    {
        return Appointment::where('doctor_id', $doctorId)->where('visit_type', 'local')->latest()->get();
    }



    public function shiftOnlinePendingByDoctorToday($doctorId , $duration)
    {
        return Appointment::where('doctor_id', $doctorId)
            ->where('visit_type', 'online')
            ->where('status', 'pending')
            ->where('date', Carbon::today()->format('Y-m-d'))
            ->latest()
            ->get()
            ->map(function ($appointment) {
                $appointment->time = Carbon::parse($appointment->time)->addMinutes(30)->format('H:i');
                return $appointment;
            });
    }

    public function shiftLocalPendingByDoctorToday($doctorId, $duration)
    {
        return Appointment::where('doctor_id', $doctorId)
            ->where('visit_type', 'local')
            ->where('status', 'pending')
            ->where('date', Carbon::today()->format('Y-m-d'))
            ->latest()
            ->get()
            ->map(function ($appointment) {
                $appointment->time = Carbon::parse($appointment->time)->addMinutes(30)->format('H:i');
                return $appointment;
            });
    }


    public function getLocalByClinic($clinic)
    {
        return Appointment::where('clinic_id', $clinic->id)
            ->where('doctor_id', Auth::id())
            ->latest()
            ->get();
    }

    public function ReservedAppointmentsTimeForDoctor($doctorId)
    {
        $appointments = Appointment::query()
            ->where('doctor_id', $doctorId)
            ->where('visit_type', '=', 'online')
            ->where('status','!=', 'cancelled')
            ->latest()
            ->get(['date', 'time']);

        return $appointments->groupBy('date')
            ->map(function ($group) {
                return $group->pluck('time');
            });

    }

    public function ReservedAppointmentsTimeForClinic($clinicId)
    {
        $appointments = Appointment::query()
            ->where('clinic_id', $clinicId)
            ->where('status','!=', 'cancelled')
            ->latest()
            ->get(['date', 'time']);

        return $appointments->groupBy('date')
            ->map(function ($group) {
                return $group->pluck('time');
            });

    }


    public function getByPatient($patientId)
    {
        return Appointment::where('patient_id', $patientId)->latest()->get();
    }

    public function getByPatientForDoctor($patientId)
    {
        return Appointment::where('patient_id', $patientId)
            ->where('doctor_id', Auth::id())
            ->where('status', 'completed')
            ->latest()
            ->get();
    }


    public function markComplete(Appointment $appointment, CompleteAppointment $request)
    {

        // Upload files and get file paths
        $uploadedFiles = $this->handleFileUploads($request);
        $validate_data = $request->validated();
        // Update appointment status & attach uploaded files
        $appointment->update([
            'another_files' => isset($uploadedFiles['another_files']) ? json_encode($uploadedFiles['another_files']) : null,
            'quick_note' => $validate_data['quick_note'] ?? null,
            'appointment_note' => $validate_data['appointment_note'] ?? null,
            'patient_note' => $validate_data['patient_note'] ?? null,
        ]);




        if ($appointment->status !== 'completed') {
            $appointment->update(['status' => 'completed']);
            // Notify patient
            $appointment->patient->user->notify(new CompleteAppointmentNotification($appointment));
        }

        return $appointment;
    }

    /**
     * Handle file uploads to Cloudinary.
     */
    private function handleFileUploads(Request $request): array
    {
        $uploadedFiles = [];

        // Upload prescription file


        // Upload multiple other files
        if ($request->hasFile('another_files')) {
            $anotherFiles = [];
            $files = $request->file('another_files'); // Can be an array or single file

            if (!is_array($files)) {
                $files = [$files]; // Convert single file to array for uniform handling
            }

            foreach ($files as $file) {
                // Get the file extension
                $extension = $file->getClientOriginalExtension();
                // Upload to Cloudinary
                $uploaded_file = $this->uploadToCloudinary($file, 'appointments');
                $anotherFiles[] = [
                    'file_path' => $uploaded_file['url'],
                    'public_id' => $uploaded_file['public_id'],
                    'extension' => $extension,
                ];
            }
            $uploadedFiles['another_files'] = $anotherFiles;
        }

        return $uploadedFiles;
    }

    /**
     * Upload a file to Cloudinary and return file details.
     */
    private function uploadToCloudinary($file, string $folder)
    {
        $cloudinaryFile = $file->storeOnCloudinary($folder);
        return [
            'url' => $cloudinaryFile->getSecurePath(),
            'public_id' => $cloudinaryFile->getPublicId(),
        ];
    }
}

