<?php

namespace App\Http\Controllers;

use App\Models\User;
use GetStream\Stream\Client;
use GetStream\Stream\Client as StreamClient;
use GetStream\StreamChat\Client as chatClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{

    public function getChatToken(Request $request,$doctorId){
        $client = new StreamClient('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');
        $chat_client =new chatClient('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');

        $userToken = $chat_client->createToken($doctorId);
        return response()->json(['token' => $userToken]);
    }

    public function generateToken(Request $request)
    {



        $chat_client =new chatClient('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');

        $token = $chat_client->createToken(strval(Auth::id()));

        return response()->json(['token' => $token]);
    }

    public function getUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json(['data' => $user]);
    }
}
