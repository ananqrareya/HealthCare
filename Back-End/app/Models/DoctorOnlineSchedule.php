<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorOnlineSchedule extends Model
{

    protected $fillable = [
        'doctor_id',
        'day',
        'start_time',
        'end_time',
        'available',
    ];

    /**
     * Relationships
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

}
