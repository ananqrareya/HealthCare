<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    protected $fillable =[
        'user_id',
        'content',
        'commentable_id',
        'commentable_type',
        'ip',
        'user_agent',
    ];

    // eager load to user
    public $with =[
        'user'
    ];
    public function user()  :BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault([
            'name'=> 'Deleted User'
        ]);
    }

    public function commentable()  :BelongsTo
    {
        return $this->morphTo();
    }
}
