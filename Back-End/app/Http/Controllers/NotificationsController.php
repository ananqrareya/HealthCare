<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    public function index()
    {
          return  response()->json([
              'data'=>Auth::user()->notifications
          ]);
    }
    public function readNotifications()
    {
        return  response()->json([
            'data'=>Auth::user()->readNotifications
        ]);
    }
    public function unReadNotifications()
    {
        return  response()->json([
            'data'=>Auth::user()->unreadNotifications
        ]);
    }
    public function makeRead(Request $request, $notificationId){

        Auth::user()->unreadNotifications()->findOrFail($notificationId)->markAsRead();
        return response()->json([
            'success'=>true,
            'message'=>'Notification marked as read'
        ]);
    }

    public function makeAllRead(Request $request){

        Auth::user()->unreadNotifications->markAsRead();

        return response()->json([
            'success'=>true,
            'message'=>'Notifications marked as read'
        ]);
    }

}
