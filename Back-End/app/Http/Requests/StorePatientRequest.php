<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'en_first_name' => 'sometimes|string|max:255',
            'en_last_name' => 'sometimes|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'phone' => 'required|string|max:15',
            'is_active' => 'required|boolean',
            'password' => [
                'required',
                'confirmed',
                'string',
                'min:6',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#]/',
            ],
            'id_number' => 'required|string|unique:patients,id_number',
            'avatar' => 'nullable|string',
            'dob' => 'required|date',
            'gender' => 'required|in:male,female',
            'blood_type' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:15|regex:/^\+?[0-9\s\-]{10,15}$/',
        ];


    }
}
