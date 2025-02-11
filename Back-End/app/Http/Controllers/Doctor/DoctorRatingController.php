<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorRatingRequest;
use App\Http\Resources\DoctorRatingCollection;
use App\Http\Resources\DoctorRatingResource;
use App\Models\Doctor;
use App\Models\DoctorRating;
use App\Services\DoctorRatingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DoctorRatingController extends Controller
{
    protected $ratingService;

    public function __construct(DoctorRatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }

    public function store(StoreDoctorRatingRequest $request): JsonResponse
    {
//        Gate::authorize('create',DoctorRating::class);

        $data = $request->validated();
        $rating = $this->ratingService->store($data);

        return (new DoctorRatingResource($rating))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Rating added successfully');
    }

    public function destroy(DoctorRating $rating): JsonResponse
    {
        Gate::authorize('delete',[DoctorRating::class,$rating]);

        $rating->is_deleted = true;
        $rating->save();

        return response()->json([
            'message' => 'Rating deleted successfully'
        ], 200);
    }

    public function index(Doctor $doctor): JsonResponse
    {
        $ratings = $this->ratingService->getAllByDoctor($doctor->id);

        return (new DoctorRatingCollection($ratings))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'Ratings retrieved successfully');
    }
}
