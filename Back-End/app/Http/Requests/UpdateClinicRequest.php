<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClinicRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'clinic_id' => [
                'sometimes',
                'integer',
                'digits:8',
                Rule::unique('clinics', 'clinic_id')->ignore($this->route('clinic')->id),
            ],
            'doctor_id' => 'sometimes|required|exists:doctors,id',
            'specialist_id'=>'sometimes|exists:categories,id',
            'ar_name' => 'sometimes|string|max:255',
            'en_name' => 'sometimes|string|max:255',
            'address' => 'sometimes',
            'details' => 'sometimes|array',
            'appointment_time'=>'sometimes|integer',
            'lat'=>'sometimes|numeric',
            'long'=>'sometimes|numeric',
            'clinic_phone'=>'sometimes|required',
            'city_id'=>'sometimes|exists:cities,id',


        ];
    }
}
