<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\ClinicCollection;
use App\Http\Resources\DoctorCollection;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use App\Models\User;
use App\Services\DoctorService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

/**
 *
 */
class DoctorController extends Controller
{
    /**
     * @var DoctorService
     */
    protected $doctorService;
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @param DoctorService $doctorService
     * @param UserService $userService
     */
    public function __construct(DoctorService $doctorService, UserService $userService)
    {
        $this->doctorService = $doctorService;
        $this->userService = $userService;
    }

    /**
     * @param StoreDoctorRequest $request
     * @return JsonResponse
     */
    public function store(StoreDoctorRequest $request): JsonResponse
    {

        $data = $request->validated();
        $data['role_id']=Role::Doctor->value;

        $user = $this->userService->createUser($data);

        return (new DoctorResource($user->doctor))
            ->response()
            ->setStatusCode(201)
            ->header('message', 'Doctor created successfully');
    }

    /**
     * @param UpdateDoctorRequest $request
     * @param Doctor $doctor
     * @return JsonResponse
     */
    public function update(UpdateDoctorRequest $request, Doctor $doctor): JsonResponse
    {
        $validated_data = $request->validated();
        $user_data = $request->only([
            'en_first_name',
            'en_last_name',
            'first_name',
            'last_name',
            'username',
            'email',
            'phone',
            'is_active',
            'password',
            'dob'
        ]);
        $doctor_data = $request->only([
            'id_number',
            'online_active',
            'speciality',
            'available',
            'about',
            'fee',
            'online_fee',
            'online_appointment_time'
        ]);
        if (isset($doctor_data['data'])){
            $doctor_data['about'] = json_encode($doctor_data['about']);

        }



        $doctor = $this->doctorService->update($doctor, $user_data, $doctor_data);

        return response()->json([
            'data' => new DoctorResource($doctor),
            'message' => 'Doctor updated successfully',
        ], 200);
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function show(Doctor $doctor): JsonResponse
    {

        $user = $doctor->user;

        return response()
            ->json(['data'=> [
                'id' => $doctor->id,
                'id_number' => $doctor->id_number,
                'online_active' => $doctor->online_active,
                'speciality' => $doctor->speciality,
                'available' => $doctor->available,
                'about' => json_decode($doctor->about),
                'fee'=>$doctor->fee,
                'online_fee'=>$doctor->online_fee,
                'ar_full_name' => $user->first_name.' '.$user->last_name,
                'en_full_name' => $user->en_first_name.' '.$user->en_last_name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'en_first_name' => $user->en_first_name,
                'en_last_name' => $user->en_last_name,
                'username' => $user->username,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'dob' => $user->dob,

                'online_appointment_time'=>$doctor->online_appointment_time,
                'rating'=>$doctor->rating,
                'email' => $user->email,
                'online_schedule'=> $doctor->online_schedule,
                'clinics'=> new ClinicCollection($doctor->clinics),

            ]])
            ->setStatusCode(200);
    }

    /**
     * @param Doctor $doctor
     * @return JsonResponse
     */
    public function destroy(Doctor $doctor): JsonResponse
    {
        $this->doctorService->delete($doctor);
        User::destroy($doctor->id);

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ], 200);
    }

    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {

        $doctors = $this->doctorService->getAll();

        return (new DoctorCollection($doctors))
            ->response()
            ->setStatusCode(200);


    }


    public function doctorsName()
    {
        return User::query()
            ->where('is_active', 1)
            ->where('role_id', \App\Enums\Role::Doctor->value)
            ->get(['id', 'first_name', 'last_name']);
    }

}
