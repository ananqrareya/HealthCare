<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use GetStream\StreamChat\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(): JsonResponse
    {

        Gate::authorize('viewAny',User::class);

        $users = User::all();
        return (new UserCollection($users))
            ->response()
            ->setStatusCode(200);

    }


    public function show(User $user): JsonResponse
    {
       return (new UserResource($user))
           ->response()
           ->setStatusCode(200)
           ->header('Message', 'User retrieved successfully');
    }

    public function store(StoreUserRequest $request): JsonResponse
    {

        try {
            $data = $request->validated();

            $data = $request->only([
                'role_id',
                'first_name',
                'last_name',
                'username',
                'email',
                'phone',
                'is_active',
                'password',
                'dob'
            ]);

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            // Create a new user with the validated data
            $user = User::create($data);

            return (new UserResource($user))
                ->response()
                ->setStatusCode(201)
                ->header('message', 'User created successfully');

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422); // 422 Unprocessable Entity
        }
    }



    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        try {
            $data = $request->only([
                'role_id',
                'first_name',
                'last_name',
                'username',
                'email',
                'phone',
                'is_active',
                'password'
            ]);

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);

            return (new UserResource($user))
                ->response()
                ->setStatusCode(200)
                ->header('message', 'User updated successfully');

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422); // 422 Unprocessable Entity
        }
    }
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }



//    public function indexStreamUsers(): JsonResponse
//    {
//
//
//        $users = User::all();
//        return (new UserCollection($users))
//            ->response()
//            ->setStatusCode(200);
//
//    }
//
//
//    public function showStreamUser(string $userId): JsonResponse
//    {
//        $client = new Client('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');
//        $userToken = $client->upsertUser([
//            'name'  => $user->first_name . ' ' . $user->last_name,
//            'username' => $user?->username,
//            'phone' => $user?->phone
//        ]);
//
//
//        return response()->json([
//            'success' => true,
//            'user' => ''
//        ])
//            ->setStatusCode(200)
//            ->header('Message', 'User retrieved successfully');
//    }
}
