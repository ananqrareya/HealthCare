<?php

use App\Http\Controllers\Appointment\AppointmentController;
use App\Http\Controllers\Payment\StripeController;
use App\Http\Controllers\Payment\StripeWebhookController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view()->make('welcome');
});

Route::get('/contacts', function () {
    $users = User::where('id', '!=', 72)->get();
    return Inertia::render('Contacts', ['users' => $users]);
})->middleware([])->name('contacts');


Route::middleware('auth:sanctum')->post('doctors/{doctor}/appointments', [AppointmentController::class, 'storeOnlineAppointment'])
    ->name('appointments.store');

Route::get('/csrf/token/get',function (\Illuminate\Http\Request $request){
    dd(request()->all());
})->name('get.csrf.token');
Route::post('stripe',[StripeController::class,'strip'])->name('stripe');
//Route::get('success',[StripeController::class,'success'])->name('success');
//Route::get('cancel',[StripeController::class,'cancel'])->name('cancel');
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);
