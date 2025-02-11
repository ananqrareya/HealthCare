<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentCollection;
use App\Http\Resources\CommentResource;
use App\Models\Appointment;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Get all comments
    public function index(Post $post): JsonResponse
    {

        $comments = $post->comments()->with('user')->latest()->get();
        return response()->json(new CommentCollection($comments));
    }

    // Get a single comment
    public function show(Post $post, Comment $comment): JsonResponse
    {
        $comment->load('user','commentable');
        return response()->json(new CommentResource($comment));
    }

    // Create a comment
    public function store(CommentRequest $request, Post $post): JsonResponse
    {

        $comment = $post->comments()->create([
            'content' => $request->post('content'),
            'user_id' => Auth::id(),
            'commentable_id' => $post->id,
            'commentable_type' => 'post',
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(new CommentResource($comment->load('user')), 201);
    }

    // Update a comment
    public function update(CommentRequest $request,Post $post, Comment $comment): JsonResponse
    {
        $comment->update([
            'content' => $request->post('content'),
        ]);

        return response()->json(new CommentResource($comment));
    }

    // Delete a comment
    public function destroy(Post $post,Comment $comment): JsonResponse
    {
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully!']);
    }
}
