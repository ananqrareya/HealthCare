<?php

namespace App\Models;

use App\Observers\ClinicObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Clinic extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'clinic_id',
        'specialist_id',
        'ar_name',
        'en_name',
        'city_id',
        'appointment_time',
        'lat',
        'long',
        'address',
        'details',
        'clinic_phone',
        'specialist_id'
    ];

    public static function boot(): void
    {
        parent::boot();
        Clinic::observe(ClinicObserver::class);
    }

    protected $casts = [
        'details' => 'array',
        'appointment_time' => 'integer',

    ];


    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function specialist(): BelongsTo
    {
        return $this->belongsTo(Category::class,'specialist_id');
    }

    public function clinic_schedule(): HasMany
    {
        return $this->hasMany(DoctorClinicSchedule::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}


