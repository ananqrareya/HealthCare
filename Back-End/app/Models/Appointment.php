<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'date',
        'time',
        'visit_type',
        'status',
        'clinic_id',
        'another_files',
        'patient_note',
        'quick_note',
        'appointment_note',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'date',
        'time' => 'datetime', // Store as datetime in the database
        'visit_type' => 'string',
        'status' => 'string',
    ];

    /**
     * Accessor for the formatted time attribute.
     *
     * @return Attribute
     */
    protected function time(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? \Carbon\Carbon::parse($value)->format('H:i') : null,

        );
    }

    /**
     * Relationships
     */

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
    public function report(): HasOne
    {
        return $this->hasOne(Report::class);
    }
    public function prescription(): HasOne
    {
        return $this->hasOne(Prescription::class);
    }


}
