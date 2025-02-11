<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClinicRequest extends FormRequest
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
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_id' => [
                'required',
                'integer',
                'digits:8',
                Rule::unique('clinics', 'clinic_id'),
            ],
            'specialist_id'=>'required|exists:categories,id',
            'city_id'=>'required|exists:cities,id',
            'ar_name' => 'required|string|max:255',
            'en_name' => 'required|string|max:255',
            'address' => 'required',
            'details' => 'sometimes|array',
            'appointment_time'=>'required|integer',

        ];



    }
}
