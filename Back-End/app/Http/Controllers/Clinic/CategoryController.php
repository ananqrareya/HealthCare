<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ClinicCollection;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::all();

        return (new CategoryCollection($categories))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Category retrieved successfully');


    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['en_name'] = ucwords($data['en_name']);
        $category = Category::create($data);

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Category created successfully');
    }

    public function show($id): JsonResponse
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'id' => $category->id,
            'en_name' => $category->en_name,
            'ar_name' => $category->ar_name,
            'clinics'=> new ClinicCollection($category->clinics),
        ])->setStatusCode(200);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $data = $request->validated();

        $category->update($data);

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(200)
            ->header('message', 'Category updated successfully');
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
