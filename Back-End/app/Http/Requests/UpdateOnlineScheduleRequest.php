<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOnlineScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow all authenticated users; customize as needed
        return true;
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
