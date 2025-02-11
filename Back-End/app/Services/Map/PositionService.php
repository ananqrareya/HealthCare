<?php

namespace App\Services\Map;

use App\Models\City;

class PositionService
{

    public static function getPosition(string  $city_id, string $street_name, string $build_name, string $name)
    {

        $country ='فلسطين';
        $city = City::query()->where('id','=',$city_id)->pluck('ar_name')->First();
        $raw_address ="$name, $build_name, $street_name, $city, $country";
        $address_parts = array_map('trim', explode(',', $raw_address));
        $address = implode(', ', $address_parts);
        $result = app('geocoder')->geocode($address)->get();

        $coordinates = $result[0]->getCoordinates();
        $lat = $coordinates->getLatitude();
        $long = $coordinates->getLongitude();
        return [
            'lat'=>$lat,
            'long'=>$long,
            'address'=>$address,
        ];
    }


}
