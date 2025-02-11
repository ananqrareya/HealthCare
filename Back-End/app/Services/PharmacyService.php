<?php

namespace App\Services;

use App\Models\Pharmacy;
use App\Models\User;
use App\Services\Map\PositionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PharmacyService
{

    public function handelAddress(Request $request, $pharmacy, $pharmacy_data)
    {
        $addressFields = ['street_name', 'build_name', 'city_id','ar_name'];
        $requiresAddressUpdate = false;

        foreach ($addressFields as $field) {
            if ($request->has($field)) {
                $requiresAddressUpdate = true;
                break;
            }
        }

        if ($requiresAddressUpdate) {
            if (!empty($pharmacy->address)) {
                // Assuming address format: "Street Name, Building Name, City, Country"
                $addressParts = explode(',', $pharmacy->address);

                $pharmacy_data['street_name'] = $pharmacy_data['street_name'] ?? $addressParts[2];
                $pharmacy_data['build_name'] = $pharmacy_data['build_name'] ?? $addressParts[1];
                $pharmacy_data['city_id'] =$pharmacy_data['city_id'] ??  $pharmacy->city_id  ;

                $requiresAddressUpdate = true;
            }
        }

        // Recalculate address if required
        if ($requiresAddressUpdate) {
            $street_name = $pharmacy_data['street_name'] ;
            $build_name = $pharmacy_data['build_name'];
            $name = $pharmacy_data['ar_name'] ?? $pharmacy->ar_name;
            $city_id = $pharmacy_data['city_id'] ;

            $position = PositionService::getPosition(
                $city_id,
                $street_name,
                $build_name,
                $name
            );

            $pharmacy_data['address'] = $position['address'] ?? $pharmacy->address;
            $pharmacy_data['lat'] = $position['lat'] ?? $pharmacy->lat;
            $pharmacy_data['long'] = $position['long'] ?? $pharmacy->long;
        }

        return $pharmacy_data;

    }
    public function update(Pharmacy $pharmacy, array $user_data, array $pharmacy_data): Pharmacy
    {
         return DB::transaction(function () use ($pharmacy, $user_data, $pharmacy_data) {

            $pharmacy->user()->update($user_data);
            $pharmacy->update($pharmacy_data);

             return $pharmacy;
         });
    }

    public function delete(Pharmacy $pharmacy): bool
    {
        return DB::transaction(function () use ($pharmacy) {
            return $pharmacy->delete();
        });
    }

    public function find($id): ?Pharmacy
    {
        return Pharmacy::with('user')->findOrFail($id);
    }


}
