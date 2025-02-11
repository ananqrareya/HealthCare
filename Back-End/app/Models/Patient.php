<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'id_number',
        'gender',
        'blood_type',
        'emergency_contact_name',
        'emergency_contact_phone',
        'is_blocked',
        'blocked_until',
        'missed_appointments'
    ];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class );
    }
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class );
    }
    public function bails(): HasMany
    {
        return $this->hasMany(Bail::class );
    }
}
