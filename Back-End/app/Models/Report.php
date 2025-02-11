<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;


    protected $fillable = [
        'file_path',
        'date',
        'appointment_id',
        'public_id'
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
