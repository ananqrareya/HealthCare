<?php

namespace App\Models;

use App\Observers\DoctorObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'id_number',
        'online_active',
        'speciality',
        'available',
        'about',
        'fee',
        'online_fee',
        'online_appointment_time'
    ];

    protected $appends =[
      'rating',
    ];
    public function getRatingAttribute(): float|int
    {
        $count  = $this->doctor_ratings->count();
        $sumOfRating = $this->doctor_ratings->sum('rating');
        return $count == 0
            ? 0
            :  round($sumOfRating / $count,1);

    }
    public static function boot(): void
    {
        parent::boot();
        Doctor::observe(DoctorObserver::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function doctor_ratings(): HasMany
    {
        return $this->hasMany(DoctorRating::class);
    }
    public function online_schedule(): HasMany
    {
        return $this->hasMany(DoctorOnlineSchedule::class);
    }

    public function clinics(): HasMany
    {
        return $this->hasMany(Clinic::class);
    }


    public function patients(): HasManyThrough
    {
        return $this->hasManyThrough(
            Patient::class,
            Appointment::class,
            'doctor_id',  // Foreign key on the appointments table
            'id',         // Foreign key on the patients table
            'id',         // Local key on the doctors table
            'patient_id'  // Local key on the appointments table
        )->where('appointments.status', 'completed')->distinct();
    }


    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'doctor_id');
    }

    public function medications(): HasMany
    {
        return $this->hasMany(Medication::class);
    }


    public function sentMessages(): MorphMany
    {
        return $this->morphMany(Message::class, 'sender_id')->latest();
    }
    public function receivedMessages(): MorphMany
    {
        return $this->morphMany(Message::class, 'recipient')->latest();
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
    public function bails(): HasMany
    {
        return $this->hasMany(Bail::class);
    }
}
