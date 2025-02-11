<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laboratory extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'position',
        'license_number',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
