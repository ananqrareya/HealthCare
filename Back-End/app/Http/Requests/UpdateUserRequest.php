<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $user_id=$this->route('user')->id;

        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'en_first_name' => 'sometimes|string|max:255',
            'en_last_name' => 'sometimes|string|max:255',
            'username' => 'sometimes|required|string|max:255|unique:users,username,' .$user_id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' .$user_id,
            'phone' => 'sometimes|string|max:15',
            'is_active' => 'sometimes|boolean',
            'email_verified_at' => 'sometimes|date|nullable',
            'dob' => 'sometimes|date',
        ];
    }
}
