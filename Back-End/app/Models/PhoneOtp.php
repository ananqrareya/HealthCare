<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneOtp extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'otp'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
