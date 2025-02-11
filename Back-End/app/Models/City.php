<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $fillable = [
        'ar_name',
        'en_name',
    ];
    public function clinics():hasMany
    {
        return $this->hasMany(Clinic::class);
    }
}
