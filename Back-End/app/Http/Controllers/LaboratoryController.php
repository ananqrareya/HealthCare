<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\StoreLaboratoryRequest;
use App\Http\Requests\UpdateLaboratoryRequest;
use App\Http\Resources\LaboratoryCollection;
use App\Http\Resources\LaboratoryResource;
use App\Services\LaboratoryService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use App\Models\Laboratory;

class LaboratoryController extends Controller
{
    protected $laboratoryService;
    protected $userService;

    public function __construct(LaboratoryService $laboratoryService, UserService $userService)
    {
        $this->laboratoryService = $laboratoryService;
        $this->userService = $userService;
    }

    public function store(StoreLaboratoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['role_id'] = Role::LaboratoryUser->value;

        $user = $this->userService->createUser($data);

        return (new LaboratoryResource($user->laboratory))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Laboratory created successfully');
    }

    public function update(UpdateLaboratoryRequest $request, Laboratory $laboratory): JsonResponse
    {
        $data = $request->validated();
        $laboratory = $this->laboratoryService->update($laboratory, $data);

        return (new LaboratoryResource($laboratory))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'Laboratory updated successfully');
    }

    public function show($id): JsonResponse
    {
        $laboratory = $this->laboratoryService->find($id);

        return (new LaboratoryResource($laboratory))
            ->response()
            ->setStatusCode(200);
    }

    public function destroy(Laboratory $laboratory): JsonResponse
    {
        $this->laboratoryService->delete($laboratory);

        return response()->json([
            'message' => 'Laboratory deleted successfully'
        ], 200);
    }

    public function index(): JsonResponse
    {
        $laboratories = $this->laboratoryService->getAll();

        return (new LaboratoryCollection($laboratories))
            ->response()
            ->setStatusCode(200);
    }
}
