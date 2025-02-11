<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AvatarController extends Controller
{
    /**
     * Upload or update avatar for a doctor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadAvatar(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        $user->deleteAvatar();

        $cloudinaryImage = $request->file('avatar')->storeOnCloudinary($user->role->name);
        $url = $cloudinaryImage->getSecurePath();
        $public_id = $cloudinaryImage->getPublicId();


        $user->avatar =$url;
        $user->avatar_id =$public_id;
        $user->save();

        return response()->json([
            'message' => 'Avatar uploaded successfully!',
            'avatar_url' => $url,
        ]);
    }

    public function adminUploadAvatar(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id'=>'required|exists:users,id'
        ]);

        $user = User::query()->findOrFail($request->input('user_id'));

        $user->deleteAvatar();

        $cloudinaryImage = $request->file('avatar')->storeOnCloudinary($user->role->name);
        $url = $cloudinaryImage->getSecurePath();
        $public_id = $cloudinaryImage->getPublicId();


        $user->avatar =$url;
        $user->avatar_id =$public_id;
        $user->save();



        return response()->json([
            'message' => 'Avatar uploaded successfully!',
            'avatar_url' => $url,
        ]);
    }

    /**
     * Delete the avatar.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar()
    {
        $user = auth()->user();

        // Delete the current avatar
        $user->deleteAvatar();

        // Update avatar to null in the database
        $user->update(['avatar' => null]);

        return response()->json([
            'message' => 'Avatar deleted successfully!',
            'avatar_url' => $user->avatar_url, // Will return the default avatar
        ]);
    }
}
