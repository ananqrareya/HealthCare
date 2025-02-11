<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

class UpdatePharmacyRequest extends FormRequest
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
        $userId = Route::current()->parameter('pharmacy')->user->id;
        return [

            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'en_first_name' => 'sometimes|required|string|max:255',
            'en_last_name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$userId,
            'phone' => 'sometimes|required|string|max:15|unique:users,phone,'.$userId,
            'is_active' => 'sometimes|required|boolean',
            'email_verified_at' => 'sometimes|required|date|nullable',
            'dob' => 'sometimes|required|required|date',


            'license_number' => 'sometimes|required|string|unique:pharmacies,license_number,'.$userId. '|max:255',
            'ar_name' => 'sometimes|required|string',
            'en_name' => 'sometimes|required|string',
            'street_name' => 'sometimes|required|string|max:255',
            'build_name' => 'sometimes|required|string|max:255',
            'city_id' => 'sometimes|required|exists:cities,id',
            'pharmacy_phone' => 'sometimes|required|string|max:15',


        ];
    }
}
