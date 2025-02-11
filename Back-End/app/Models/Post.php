<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    protected $fillable =[
        'doctor_id',
        'content',
    ];
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class,'commentable');
    }
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
