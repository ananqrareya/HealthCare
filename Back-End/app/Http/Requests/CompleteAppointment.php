<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteAppointment extends FormRequest
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
            'another_files' => 'sometimes',
            'another_files.*' => 'sometimes|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif|nullable', // Validate each file
            'patient_note' => 'sometimes|json|nullable',
            'quick_note' => 'sometimes|json|nullable',
            'appointment_note' => 'sometimes|json|nullable',
        ];

    }
}
