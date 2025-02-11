<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
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
            'appointment_id' => 'required|exists:appointments,id',
            'prescription_file' => 'required|file',
            'medications' => 'sometimes|nullable',
        ];
    }


    /**
     * Custom messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'doctor_id.required' => 'Doctor ID is required.',
            'doctor_id.exists' => 'Doctor ID must exist in the doctors table.',
            'patient_id.required' => 'Patient ID is required.',
            'patient_id.exists' => 'Patient ID must exist in the patients table.',
            'date.required' => 'Date is required.',
            'date.date' => 'Date must be a valid date.',
            'medications.required' => 'At least one medication is required.',
            'medications.*.name.required' => 'Medication name is required.',
            'medications.*.dosage.required' => 'Medication dosage is required.',
            'medications.*.instructions.required' => 'Medication instructions are required.',
        ];
    }
}
