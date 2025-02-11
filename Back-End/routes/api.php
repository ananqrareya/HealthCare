<?php

use App\Http\Controllers\Appointment\AppointmentController;
use App\Http\Controllers\Appointment\BailController;
use App\Http\Controllers\City\CityController;
use App\Http\Controllers\Clinic\CategoryController;
use App\Http\Controllers\Clinic\ClinicController;
use App\Http\Controllers\Clinic\DoctorClinicScheduleController;
use App\Http\Controllers\Doctor\DoctorController;
use App\Http\Controllers\Doctor\DoctorRatingController;
use App\Http\Controllers\Doctor\OnlineScheduleController;
use App\Http\Controllers\Doctor\ReportController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\Patient\PatientController;
use App\Http\Controllers\Payment\MessageController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Pharmacy\PharmacyController;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\User\AvatarController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;



Route::get('/', function () {
    return 'API';
});
//Route::apiResource('doctors', DoctorController::class);

Route::middleware(['auth:sanctum'])->group(function () {


    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);

    Route::post('doctors', [DoctorController::class, 'store']);
    Route::put('doctors/{doctor}/update', [DoctorController::class, 'update']);

    Route::get('patients', [PatientController::class, 'index']);
    Route::post('patients', [PatientController::class, 'store']);
    Route::get('patients/{patient}', [PatientController::class, 'show']);
    Route::put('patients/{patient}', [PatientController::class, 'update']);
    Route::delete('patients/{patient}', [PatientController::class, 'destroy']);
    Route::get('patients-for-doctor', [PatientController::class, 'patientForDoctor']);


    Route::post('clinics', [ClinicController::class, 'store']);
    Route::put('clinics/{clinic}', [ClinicController::class, 'update']);
    Route::delete('clinics/{clinic}', [ClinicController::class, 'destroy']);

   Route::post('pharmacies', [PharmacyController::class, 'store']);

    Route::put('pharmacies/{pharmacy}', [PharmacyController::class, 'update']);
    Route::delete('pharmacies/{pharmacy}', [PharmacyController::class, 'destroy']);

    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('laboratories', [LaboratoryController::class, 'index']);
    Route::post('laboratories', [LaboratoryController::class, 'store']);
    Route::get('laboratories/{laboratory}', [LaboratoryController::class, 'show']);
    Route::put('laboratories/{laboratory}', [LaboratoryController::class, 'update']);
    Route::delete('laboratories/{laboratory}', [LaboratoryController::class, 'destroy']);


    Route::post('cities', [CityController::class, 'store']);
    Route::put('cities/{city}', [CityController::class, 'update']);
    Route::delete('cities/{city}', [CityController::class, 'destroy']);

    Route::get('messages', [MessageController::class, 'index']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::get('messages/{message}', [MessageController::class, 'show']);
    Route::put('messages/{message}', [MessageController::class, 'update']);
    Route::delete('messages/{message}', [MessageController::class, 'destroy']);



    Route::post('ratings', [DoctorRatingController::class,'store']);
    Route::delete('ratings/{rating}', [DoctorRatingController::class,'destroy']);
    Route::get('doctors/{doctor}/ratings', [DoctorRatingController::class,'index']);



    Route::prefix('doctors/{doctor}/posts')->group(function () {
        Route::get('/', [PostController::class, 'getAllPosts']);
        Route::post('/', [PostController::class, 'store']);
        Route::put('/{post}', [PostController::class, 'update']);
    });

    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::get('/{post}', [PostController::class, 'show']);
        Route::delete('/{post}', [PostController::class, 'destroy']);
    });


    //  appointment routes
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    Route::get('/patients/{patient}/appointments', [AppointmentController::class, 'getAppointmentsByPatient']);
    Route::get('/patients/{patient}/doctor-appointments', [AppointmentController::class, 'getAppointmentsByPatientForDoctor']);

    Route::get('/doctors/{doctor}/appointments', [AppointmentController::class, 'getAppointmentsByDoctor'])->name('doctor.appointments');
    Route::get('/doctors/{doctor}/online-appointments', [AppointmentController::class, 'getOnlineAppointmentsByDoctor'])->name('doctor.online.appointments');
    Route::get('/doctors/{doctor}/local-appointments', [AppointmentController::class, 'getLocalAppointmentsByDoctor'])->name('doctor.local.appointments');
    Route::put('/appointments/online/shift', [AppointmentController::class, 'shiftOnlineAppointment']);
    Route::put('/appointments/local/shift', [AppointmentController::class, 'shiftLocalAppointment']);


    Route::prefix('doctors/{doctor}/online-schedule')->group(function () {
        Route::get('/view', [OnlineScheduleController::class, 'viewSchedules']);
        Route::patch('/{scheduleId}/update', [OnlineScheduleController::class, 'updateSingleSchedule']);
        Route::patch('/toggle', [OnlineScheduleController::class, 'toggleOnlineStatus']);
    });


    Route::prefix('doctors/{doctor}/clinics/{clinic}')->group(function () {
        Route::get('/schedule', [DoctorClinicScheduleController::class, 'show']);
        Route::put('/schedule/{id}', [DoctorClinicScheduleController::class, 'update']);
    });


    Route::middleware('auth:sanctum')->post('clinics/{clinic}/appointments', [AppointmentController::class, 'storeClinicAppointment'])->name('appointments.storeClinicAppointment');

    Route::middleware('auth:sanctum')->post('doctors/{doctor}/appointments', [AppointmentController::class, 'storeOnlineAppointment'])->name('api.appointments.store');


    Route::get('doctors/{doctor}/chat', [MessageController::class, 'chat']);

    Route::get('admin/dashboard', \App\Http\Controllers\Dashboard\AdminDashboardController::class);
    Route::get('doctor/dashboard', \App\Http\Controllers\Dashboard\DoctorDashboardController::class);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::post('/appointments/{appointment}/mark-missed', [AppointmentController::class, 'markMissed']);
    Route::post('/appointments/{appointment}/mark-cancel', [AppointmentController::class, 'markCancel']);
    Route::post('/appointments/{appointment}/mark-complete', [AppointmentController::class, 'markComplete']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('clinics/{clinic}/appointments', [AppointmentController::class, 'allClinicAppointment']);

    Route::get('notifications', [\App\Http\Controllers\NotificationsController::class, 'index']);
    Route::get('notifications/unread', [\App\Http\Controllers\NotificationsController::class, 'unreadNotifications']);
    Route::get('notifications/read', [\App\Http\Controllers\NotificationsController::class, 'readNotifications']);

    Route::patch('notifications/{notification}/makeRead', [\App\Http\Controllers\NotificationsController::class, 'makeRead']);
    Route::patch('notifications', [\App\Http\Controllers\NotificationsController::class, 'makeAllRead']);

    Route::get('/medications', [MedicationController::class, 'index']); // Get all medications
    Route::post('/medications', [MedicationController::class, 'store']); // Create a medication
    Route::get('/medications/{id}', [MedicationController::class, 'show']); // Get a single medication
    Route::put('/medications/{id}', [MedicationController::class, 'update']); // Update a medication
    Route::delete('/medications/{id}', [MedicationController::class, 'destroy']); // Delete a medication});

});
Route::delete('users/{user}', [UserController::class, 'destroy']);
Route::delete('patients/{patient}', [PatientController::class, 'destroy']);
Route::delete('doctors/{doctor}', [DoctorController::class, 'destroy']);

Route::get('stream/users', [UserController::class, 'indexStreamUsers']);
Route::get('stream/users/{userId}', [UserController::class, 'showStreamUser']);

Route::get('pharmacies', [PharmacyController::class, 'index']);
Route::get('pharmacies/{pharmacy}', [PharmacyController::class, 'show']);
Route::get('cities/{city}', [CityController::class, 'show']);
Route::get('categories/{category}', [CategoryController::class, 'show']);
Route::get('clinics/{clinic}/ReservedAppointments', [AppointmentController::class, 'getReservedAppointmentsByClinic']);

Route::get('doctors/{doctor}/ReservedAppointments', [AppointmentController::class, 'getReservedAppointmentsByDoctor']);
Route::get('cities', [CityController::class, 'index']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('doctors', [DoctorController::class, 'index']);
Route::get('doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('clinics', [ClinicController::class, 'index']);
Route::get('clinics/{clinic}', [ClinicController::class, 'show']);
// Face and Patient Verification
Route::post('/face/quickscan',App\Services\Scanner\QuickScanServices::class);
Route::post('/face/verification',App\Services\Scanner\FaceVer::class);
Route::post('/patient/verification',App\Services\Scanner\PatientCardValidationServices::class);

// payment success and cancel url
Route::post('/payment/cancel/{appointment}',[PaymentController::class,'cancel'])->name('payment.cancel');
Route::post('/payment/success/{appointment}',[PaymentController::class,'success'])->name('payment.success');

// Bail Management
Route::post('bails/{bail}/download/invoice', [BailController::class, 'getInvoiceAsPdf']);
Route::get('patients/{patient}/bails',[BailController::class, 'getPatientBails'] );
Route::get('doctors/{doctor}/patients/{patient}/bails', [BailController::class, 'getDoctorBails']);


// Avatar Management
Route::middleware(['auth:sanctum'])->post('/avatar', [AvatarController::class, 'uploadAvatar']);
Route::middleware(['auth:sanctum'])->delete('/avatar', [AvatarController::class, 'deleteAvatar']);
Route::post('/user/avatar', [AvatarController::class, 'adminUploadAvatar']);

// Chat
Route::middleware(['auth:sanctum'])->post('/generate-token', [\App\Http\Controllers\ChatController::class, 'generateToken']);
Route::get('/get-user/{id}', [\App\Http\Controllers\ChatController::class, 'getUser']);
Route::get('/chat/token/{doctorId}',[\App\Http\Controllers\ChatController::class, 'getChatToken']);

// Doctor Names
Route::get('doctors-names',[DoctorController::class, 'doctorsName']);



//
//Route::post('/incoming-call', [App\Http\Controllers\CallController::class, 'handleIncomingCall']);
//Route::post('/transcription-callback', [App\Http\Controllers\CallController::class, 'transcriptionCallback'])->name('transcription.callback');



require __DIR__.'/auth.php';
