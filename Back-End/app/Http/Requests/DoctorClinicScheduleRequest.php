<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Clinic;

class DoctorClinicScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust based on authentication logic
    }

    public function rules(): array
    {
        return [
            'start_time' => 'required|required|date_format:H:i',
            'end_time' => 'required|required|date_format:H:i|after:start_time',
            'available' => 'sometimes|boolean',
        ];
    }

}
