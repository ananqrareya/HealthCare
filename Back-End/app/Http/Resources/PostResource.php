<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'content'=>$this->content,
            'created_at'=>$this->created_at,
            'doctor'=>[
                'id'=>$this->doctor->id,
                'name'=>$this->doctor->user->name,
            ],
            'comments'=> new CommentCollection($this->comments),
        ];
    }
}
