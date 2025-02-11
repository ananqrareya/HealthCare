<?php

namespace App\Models;

use CloudinaryLabs\CloudinaryLaravel\CloudinaryEngine;
use Illuminate\Database\Eloquent\Casts\Attribute;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role_id',
        'first_name',
        'last_name',
        'username',
        'email',
        'phone',
        'is_active',
        'password',
        'email_verified_at',
        'avatar',
        'avatar_id',
        'dob',
        'phone_verified_at',
        'email_otp_resend_count',
        'email_otp_last_sent_at',
        'phone_otp_resend_count',
        'phone_otp_last_sent_at',
        'en_first_name',
        'en_last_name'

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ( $value) =>  $value ? : $value = 'https://res.cloudinary.com/dbzkboutj/image/upload/v1736553373/Patient/mlixywcfkcgir94eldtr.png',
        );
    }

    /**
     * Delete the current avatar from Cloudinary, if exists.
     */
    public function deleteAvatar()
    {
        if ($this->avatar) {
            $this->avatar = null;
            if ($this->avatar_id){
                Cloudinary::destroy($this->avatar_id);
                $this->avatar_id = null;
            }

        }
    }


    protected $appends = ['name','en_name'];

    public function getNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }


    public function getEnNameAttribute(): string
    {
        return $this->en_first_name.' '.$this->en_last_name;

    }

    public function routeNotificationForVonage(Notification $notification): string
    {
        return '+972597376520';
    }
//    public function receivesBroadcastNotificationsOn(): string
//    {
//        return 'users.'.$this->id;
//    }

    public function receivesBroadcastNotificationsOn(): string
    {
        return 'appointments.'.$this->id;
    }

    /**
     * Get the attributes thatshould be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',

        ];
    }




    public function patient():HasOne
    {
        return $this->hasOne(Patient::class);
    }
    public function doctor():HasOne
    {
        return $this->hasOne(Doctor::class);
    }
    public function pharmacy():HasOne
    {
        return $this->hasOne(Pharmacy::class);
    }

    public function laboratory():HasOne
    {
        return $this->hasOne(Laboratory::class);
    }

    public function role():BelongsTo
    {
        return $this->belongsTo(Role::class);
    }


    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')->latest();
    }

    public function sentMessages(): MorphMany
    {
        return $this->morphMany(Message::class, 'sender_id')->latest();
    }
    public function receivedMessages(): MorphMany
    {
        return $this->morphMany(Message::class, 'recipient')->latest();
    }

    protected $casts = [
        'email_otp_last_sent_at' => 'datetime',
        'phone_otp_last_sent_at' => 'datetime',

    ];


}
