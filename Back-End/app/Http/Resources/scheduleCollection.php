<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class scheduleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     *
     */
    public function toArray(Request $request)
    {
        return $this->collection;
    }
}
