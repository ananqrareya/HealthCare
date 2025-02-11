<?php

namespace App\Services;

use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class LaboratoryService
{


    public function update(Laboratory $laboratory, array $data): Laboratory
    {
        return DB::transaction(function () use ($laboratory, $data) {
            $laboratory->update($data);
            return $laboratory;
        });
    }

    public function delete(Laboratory $laboratory): bool
    {
        return DB::transaction(function () use ($laboratory) {
            return $laboratory->delete();
        });
    }

    public function find($id): ?Laboratory
    {
        return Laboratory::with('user')->findOrFail($id);
    }

    public function getAll()
    {
        return Laboratory::query()->get();
    }
}
