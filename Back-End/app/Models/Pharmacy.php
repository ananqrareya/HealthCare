<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'en_name',
        'ar_name',
        'address',
        'license_number',
        'user_id',
        'city_id',
        'lat',
        'long',
        'pharmacy_phone'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function city():BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
