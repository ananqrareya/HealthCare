<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Bail extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'invoice_id',
        'doctor_id',
        'patient_id',
        'number',
        'service_details',
        'date',
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
    public function appointment(): HasOne
    {
        return $this->hasOne(Appointment::class);
    }

}
