<?php

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;



Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $id;
});


Broadcast::channel('classroom.message.{id}',function ($user ,$id){

        return $user;

});
Broadcast::channel('appointment.doctor.{id}',function ($user ,$id){

    return $user;

});

Broadcast::channel('video-call.{id}', function ($user, $id) {
    return  $user;
});

Broadcast::channel('appointments.doctor.{id}', function (User $user, int $id) {
    return $user->id === (int) $id;
});

Broadcast::channel('appointments.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $user;
});
Broadcast::channel('appointments.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $user;
});
