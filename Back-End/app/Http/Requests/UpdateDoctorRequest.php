<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorRequest extends FormRequest
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

        $user=$this->route('doctor');

        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'en_first_name' => 'sometimes|required|string|max:255',
            'en_last_name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' .$user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' .$user->id,
            'phone' => 'sometimes|string|max:15',
            'is_active' => 'sometimes|boolean',
            'email_verified_at' => 'sometimes|date|nullable',
            'id_number' => 'sometimes|string|unique:doctors,id_number,' . $this->doctor->id,
            'online_active' => 'sometimes|boolean',
            'speciality' => 'sometimes|string|max:255',
            'available' => 'sometimes|boolean',
            'about' => 'sometimes|nullable',
            'dob' => 'sometimes|date',
            'fee' => 'sometimes|numeric',
            'online_fee' => 'sometimes|numeric',
            'password' => [
                'sometimes',
                'required',
                'confirmed',
                'string',
                'min:6',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#]/',
            ],
            'online_appointment_time' => 'sometimes|integer|nullable',
        ];
    }
}
