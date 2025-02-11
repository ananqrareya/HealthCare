<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id'   => 'required|exists:patients,id',
            'doctor_id'   => 'required|exists:doctors,id',
            'rating'      => 'required|integer|min:1|max:5',
            'review'      => 'nullable|string',
        ];
    }
}
