<?php

namespace App\Http\Controllers\City;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCityRequest;
use App\Http\Requests\UpdateCityRequest;
use App\Http\Resources\CityCollection;
use App\Http\Resources\CityResource;
use App\Http\Resources\ClinicCollection;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class CityController extends Controller
{
    /**
     * Display a listing of the cities.
     */
    public function index(): JsonResponse
    {
        $cities = City::all();

        return (new CityCollection($cities))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'Cities retrieved successfully');

    }

    /**
     * Store a newly created city in storage.
     */
    public function store(StoreCityRequest $request): JsonResponse
    {
        Gate::authorize('create',City::class);

        $data = $request->validated();

        $city = City::create($data);

        return (new CityResource($city))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'City created successfully');
    }

    /**
     * Display the specified city.
     */
    public function show($id): JsonResponse
    {

        $city = City::findOrFail($id);

        return response()->json([
            'id' => $city->id,
            'en_name' => $city->en_name,
            'ar_name' => $city->ar_name,
            'clinics' => new ClinicCollection($city->clinics),
        ])->setStatusCode(200);
    }

    /**
     * Update the specified city in storage.
     */
    public function update(UpdateCityRequest $request, City $city): JsonResponse
    {
        Gate::authorize('update',[City::class, $city]);

        $data = $request->validated();

        $city->update($data);

        return (new CityResource($city))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'City updated successfully');
    }

    /**
     * Remove the specified city from storage.
     */
    public function destroy(City $city): JsonResponse
    {

        Gate::authorize('delete',[City::class, $city]);

        $city->delete();

        return response()->json([
            'message' => 'City deleted successfully'
        ], 200);
    }
}
