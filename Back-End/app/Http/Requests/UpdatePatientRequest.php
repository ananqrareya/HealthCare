<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
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
            $user=$this->route('patient');

        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' .$user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' .$user->id,
            'phone' => 'sometimes|string|max:15',
            'is_active' => 'sometimes|boolean',
            'id_number' => 'sometimes|string|unique:patients,id_number,' . $this->patient->id,
            'dob' => 'sometimes|date',
            'gender' => 'sometimes|required|in:male,female',
            'blood_type' => 'sometimes|required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:15|regex:/^\+?[0-9\s\-]{10,15}$/',


        ];

    }
}
