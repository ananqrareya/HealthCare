<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePharmacyRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'en_first_name' => 'required|string|max:255',
            'en_last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',

            'email' => 'required|string|email|max:255|unique:users',
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
            'dob' => 'required|date',

            'ar_name' => 'required|string|unique:pharmacies,ar_name|max:255',
            'en_name' => 'required|string|unique:pharmacies,en_name|max:255',
            'street_name' => 'required|string|max:255',
            'build_name' => 'required|string|max:255',
            'license_number' => 'required|string|unique:pharmacies,license_number|max:255',
            'city_id' => 'required|exists:cities,id',
            'pharmacy_phone' => 'required|string|max:15',


        ];
    }
}

