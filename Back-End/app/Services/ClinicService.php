<?php

namespace App\Services;

use App\Models\City;
use App\Models\Clinic;
use App\Services\Map\PositionService;
use Illuminate\Support\Facades\DB;

class ClinicService
{
    public function store(array $data): Clinic
    {


        $street_name = $data['address']['address_line_1'] ?? '';
        $build_name =$data['address']['address_line_2'] ?? '';
        $name = $data['ar_name'] ?? '';

        $position = PositionService::getPosition(
            $data['city_id'],
            $street_name,
            $build_name,
            $name
        );
        $data['address'] = json_encode($data['address'], JSON_UNESCAPED_UNICODE);
        $data['lat'] = $position['lat'];
        $data['long'] = $position['long'];


        return DB::transaction(function () use ($data) {
            return Clinic::create($data);
        });
    }

    public function update(Clinic $clinic, array $data): Clinic
    {


        $address_db = json_decode($clinic->address);
        if (isset($data['address']['address_line_1'])) {
            $address_db->address_line_1 = $data['address']['address_line_1'];
        }
        if (isset($data['address']['address_line_2'])) {
            $address_db->address_line_2 = $data['address']['address_line_2'];
        }
        if (isset($data['address']['address_line_3'])) {
            $address_db->address_line_3 = $data['address']['address_line_3'];
        }

        $street_name = $address_db->address_line_1; ;
        $build_name =$address_db->address_line_2;

        $name = $data['ar_name'] ?? $clinic->ar_name;
        $city_id = $data['city_id'] ?? $clinic->city_id;

        $position = PositionService::getPosition(
            $city_id,
            $street_name,
            $build_name,
            $name
        );
        $data['address'] = json_encode($address_db, JSON_UNESCAPED_UNICODE);
        $data['lat'] = $position['lat'];
        $data['long'] = $position['long'];



        return DB::transaction(function () use ($clinic, $data) {
            $clinic->update($data);
            return $clinic;
        });
    }

    public function delete(Clinic $clinic): bool
    {
        return DB::transaction(function () use ($clinic) {
            return $clinic->delete();
        });
    }

    public function find($id): ?Clinic
    {
        return Clinic::query()->findOrFail($id);
    }

    public function getAll()
    {
        return Clinic::query()->get();
    }
}
