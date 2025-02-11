<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\Doctor;
use App\Models\Laboratory;
use App\Models\Patient;
use App\Models\Pharmacy;
use Illuminate\Support\Facades\Gate;

class AdminDashboardController extends Controller
{
    public function __invoke(): \Illuminate\Http\JsonResponse
    {

        if (!Gate::allows('view-admin-dashboard')) {
            abort(403, 'Unauthorized');
        }

        $doctors = Doctor::query()->whereHas('user', function ($query) {
            $query->where('is_active', 1);
        })->latest()->get();

        $patients = Patient::query()->whereHas('user', function ($query) {
            $query->where('is_active', 1);
        })->latest()->get();

        $pharmacies = Pharmacy::query()->whereHas('user', function ($query) {
            $query->where('is_active', 1);
        })->latest()->get();

        $laboratories = Laboratory::query()->whereHas('user', function ($query) {
            $query->where('is_active', 1);
        })->latest()->get();

        return response()->json([
            'doctor_count' => $doctors->count(),
            'patient_count' => $patients->count(),
            'pharmacy_count' => $pharmacies->count(),
            'laboratory_count' => $laboratories->count(),
            'city_count' => City::all()->count(),
            'specialist_count' => Category::all()->count(),
            'last_doctors' => $doctors->load('user:id,first_name,last_name,en_first_name,en_last_name,avatar')->take(5),
            'last_patients' => $patients->load('user:id,first_name,last_name,avatar')->take(5),
            'last_laboratories' => $laboratories->load('user:id,first_name,last_name,avatar')->take(5),
            'last_pharmacies' => $pharmacies->load('user:id,first_name,last_name,avatar')->take(5),

        ]);

    }
}
