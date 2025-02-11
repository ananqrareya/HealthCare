<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class PostController extends Controller
{
    // Get all posts
    public function index(): JsonResponse
    {
        $posts = Post::query()->latest()->get();
        return response()->json(new PostCollection($posts));
    }
    public function getAllPosts(Doctor $doctor): JsonResponse
    {
        $posts = $doctor->posts()->get();
        return response()->json(new PostCollection($posts));
    }

    // Get a single post
    public function show(Post $post): JsonResponse
    {
        return response()->json(new PostResource($post));
    }

    // Create a post
    public function store(PostRequest $request, Doctor $doctor): JsonResponse
    {
        $post = $doctor->posts()->create([
            'content' => $request->post('content'),
        ]);

        return response()->json(new PostResource($post), 201);
    }

    // Update a post
    public function update(PostRequest $request,Doctor $doctor, Post $post): JsonResponse
    {

          $doctor->posts()->findOrFail($post->id)->update([
            'content' => $request->post('content') ?? $post->content,

        ]);

        $post->refresh();

        return response()->json(new PostResource($post));
    }

    // Delete a post
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully!']);
    }
}
