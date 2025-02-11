<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorClinicSchedule extends Model
{

    protected $fillable = [
        'clinic_id',
        'day',
        'start_time',
        'end_time',
        'available',
    ];

    /**
     * Relationships
     */
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
