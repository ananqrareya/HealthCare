<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Message extends Model
{

    protected $fillable=[
        'recipient_id' ,
        'recipient_type' ,
        'sender_id',
        'body',
    ];
    protected $appends=[
        'sent_at'
    ];
    public function getSentAtAttribute()
    {
        return $this->created_at->format('g:i a');
    }

    public function sender() :BelongsTo
    {
        return $this->belongsTo(User::class,'sender_id');
    }

    public function recipient() :MorphTo
    {
        return $this->morphTo();
    }
}
