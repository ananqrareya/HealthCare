<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'ar_name',
        'en_name',
        ];

    public function clinics():HasMany
    {
        return $this->hasMany(Clinic::class,'specialist_id');
    }
}
