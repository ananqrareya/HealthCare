<?php

namespace App\Services;

use App\Enums\Role;
use App\Models\Laboratory;
use App\Models\Pharmacy;
use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Services\Map\PositionService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use GetStream\Stream\Client as StreamClient;
use \GetStream\StreamChat\Client as chatClient;
class UserService
{
    /**
     * Create a new user and handle role-specific data.
     */
    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Create the base user
            $user = User::create([
                'role_id' => $data['role_id'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'username' => $data['username'],
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'],
                'is_active' => $data['is_active'],
                'password' => Hash::make($data['password']),
                'dob' => $data['dob'],
                'en_first_name' => $data['en_first_name']?? null,
                'en_last_name' => $data['en_last_name']?? null,
            ]);
            try {
                 $client = new StreamClient('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');
                 $chat_client =new chatClient('r9xpc8rq9tgq', 'f935mjymttgjv3w659spqnn3wtazef5staarw2ewdz4txj8vkeu57fgpujjskrc7');

                 $client->createUserSessionToken(strval($user->id));
                 $chat_client->upsertUser([
                    'id' => strval($user->id),
                    'name'  => $user->first_name . ' ' . $user->last_name,
                    'username' => $user?->username,
                    'phone' => $user?->phone
                ]);


                $client->users()->add(
                    strval($user->id),
                    array(
                        'name'  => $user->first_name . ' ' . $user->last_name,
                        'username' => $user?->username,
                        'phone' => $user?->phone
                    )
                );


            } catch (\Exception $e) {
                echo "Error adding user: " . $e->getMessage();
            }

            $this->handleRoleSpecificData($user, $data);

            return $user;
        });
    }

    /**
     * Handle role-specific data creation.
     */
    private function handleRoleSpecificData(User $user, array $data): void
    {
        switch ($user->role_id) {
            case Role::Patient->value:
                $this->createPatient($user->id, $data);
                break;

            case Role::Doctor->value:
                $this->createDoctor($user->id, $data);
                break;

            case Role::PharmacyUser->value:
                $this->createPharmacy($user->id, $data);
                break;

            case Role::LaboratoryUser->value:
                $this->createLaboratory($user->id, $data);
                break;

            default:
                throw new \Exception("Invalid role ID: {$user->role_id}");
        }
    }

    /**
     * Create a pharmacy user.
     */
    public function createPharmacy(int $userId, array $data)
    {
        $street_name = $data['street_name'] ?? '';
        $build_name =$data['build_name'] ?? '';
        $name = $data['ar_name'] ?? '';

        $position = PositionService::getPosition(
            $data['city_id'],
            $street_name,
            $build_name,
            $name
        );

        $data['address'] = $position['address'];

        return Pharmacy::create([
            'id' => $userId,
            'user_id' => $userId,
            'ar_name' => $data['ar_name'],
            'en_name' => $data['en_name'],
            'address' => $data['address'],
            'license_number' => $data['license_number'],
            'lat'=>$position['lat'],
            'long'=>$position['long'],
            'city_id' => $data['city_id'],
            'pharmacy_phone'=>$data['pharmacy_phone'],
        ]);
    }

    /**
     * Create a laboratory user.
     */
    public function createLaboratory(int $userId, array $data)
    {
        return Laboratory::create([
            'id' => $userId,
            'user_id' => $userId,
            'name' => $data['name'],
            'position' => $data['position'],
            'license_number' => $data['license_number'],
        ]);
    }

    /**
     * Create a patient user.
     */
    private function createPatient(int $userId, array $data): Patient
    {
        return Patient::create([
            'id' => $userId,
            'user_id' => $userId,
            'id_number' => $data['id_number'],
            'gender' =>  $data['gender'],
            'blood_type' =>  $data['blood_type'],
            'emergency_contact_name' =>  $data['emergency_contact_name'] ?? null,
            'emergency_contact_phone' =>  $data['emergency_contact_phone'] ?? null,

        ]);
    }

    /**
     * Create a doctor user.
     */
    private function createDoctor(int $userId, array $data): Doctor
    {
        return Doctor::create([
            'id' => $userId,
            'user_id' => $userId,
            'id_number' => $data['id_number'],
            'online_active' => false,
            'speciality' => $data['speciality'],
            'available' => true,
            'about' => isset($data['about']) ? json_encode($data['about']) : null,
            'fee' => $data['fee'] ?? 0,
        ]);
    }



    public function findById(int $userId)
    {
        return User::query()->findOrFail($userId);
    }


}
