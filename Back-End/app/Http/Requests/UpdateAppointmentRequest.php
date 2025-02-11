<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'sometimes|exists:patients,id',
            'clinic_id' => 'sometimes|exists:clinics,id',
            'doctor_id' => 'sometimes|exists:doctors,id',
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i',
            'visit_type' => 'sometimes|in:online,locale',
            'status' => 'nullable|in:completed,pending,confirmed,cancelled',

        ];
    }
}
