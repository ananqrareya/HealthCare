<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;
use App\Http\Resources\MedicationResource;
use Illuminate\Support\Facades\Auth;

// Optionally, use a Resource to format the response.

class MedicationController extends Controller
{
    // Get all medications
    public function index()
    {
        $medications = Auth::user()->doctor->medications;
        return MedicationResource::collection($medications); // Optionally wrap in a resource
    }

    // Create a new medication
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'dosage' => 'required|string',
            'instructions' => 'required|string',
        ]);

        $data['doctor_id'] = Auth::id();
        $medication = Medication::create($data);
        return new MedicationResource($medication); // Optionally wrap in a resource
    }

    // Get a specific medication
    public function show($id)
    {
        $medication = Medication::findOrFail($id);
        return new MedicationResource($medication); // Optionally wrap in a resource
    }

    // Update a medication
    public function update(Request $request, $id)
    {
        $medication = Medication::findOrFail($id);

        $request->validate([
            'name' => 'string',
            'dosage' => 'string',
            'instructions' => 'string',
        ]);

        $medication->update($request->all());
        return new MedicationResource($medication); // Optionally wrap in a resource
    }

    // Delete a medication
    public function destroy($id)
    {
        $medication = Medication::findOrFail($id);
        $medication->delete();
        return response()->json(['message' => 'Medication deleted successfully']);
    }
}
