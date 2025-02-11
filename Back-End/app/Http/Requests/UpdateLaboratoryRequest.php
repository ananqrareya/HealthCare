<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLaboratoryRequest extends FormRequest
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
            'position' => 'sometimes|string|max:255',
            'name' => 'sometimes|string|unique:laboratories,name,' . $this->laboratory->id . '|max:255',
            'license_number' => 'sometimes|string|unique:laboratories,license_number,' . $this->laboratory->id . '|max:255',
            'dob' => 'sometimes|date',

        ];
    }
}
