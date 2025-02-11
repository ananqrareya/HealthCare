<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class scheduleResource extends JsonResource
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
               'day' => $this->day,
               'start_time' => $this->start_time,
               'end_time' => $this->end_time,
               'available' => $this->available,
        ];

    }
}
