<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'public_id',
        'date',
        'medications',
        'file_path',
    ];

    protected $casts = [
        'medications' => 'array', // Cast medications JSON field to an array
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    /**
     * Get the doctor through the appointment.
     */
    public function doctor()
    {
        return $this->hasOneThrough(Doctor::class, Appointment::class, 'id', 'id', 'appointment_id', 'doctor_id');
    }

    /**
     * Get the patient through the appointment.
     */
    public function patient()
    {
        return $this->hasOneThrough(Patient::class, Appointment::class, 'id', 'id', 'appointment_id', 'patient_id');
    }
}
