<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PatientsTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run()
    {
        // An array of patients including both user fields and patient-specific fields.
        $patients = [

            [
                'first_name' => 'خالد',
                'last_name'  => 'الأسود',
                'username'   => 'khalid_alaswad',
                'email'      => 'khalid@ps.com',
                'phone'      => '0561111222',
                'dob'        => '1995-07-12',
                'password'   => Hash::make('password'),
                'id_number'              => '55566677788',
                'gender'                 => 'male',
                'blood_type'             => 'O+',
                'emergency_contact_name' => 'سارة',
                'emergency_contact_phone'=> '0562222333',
            ],
            [
                'first_name' => 'ليلى',
                'last_name'  => 'الحسن',
                'username'   => 'laila_alhasan',
                'email'      => 'laila@ps.com',
                'phone'      => '0562222444',
                'dob'        => '1998-03-22',
                'password'   => Hash::make('password'),
                'id_number'              => '66677788899',
                'gender'                 => 'female',
                'blood_type'             => 'B+',
                'emergency_contact_name' => 'أبو ليلى',
                'emergency_contact_phone'=> '0563333555',
            ],
            [
                'first_name' => 'سامي',
                'last_name'  => 'المطلع',
                'username'   => 'sami_almatal',
                'email'      => 'sami@ps.com',
                'phone'      => '0563333666',
                'dob'        => '2000-12-05',
                'password'   => Hash::make('password'),
                'id_number'              => '77788899900',
                'gender'                 => 'male',
                'blood_type'             => 'AB-',
                'emergency_contact_name' => 'منى',
                'emergency_contact_phone'=> '0564444777',
            ],
            [
                'first_name' => 'نور',
                'last_name'  => 'الضياء',
                'username'   => 'noor_aldiaa',
                'email'      => 'noor@ps.com',
                'phone'      => '0564444888',
                'dob'        => '1999-09-09',
                'password'   => Hash::make('password'),
                'id_number'              => '88899900011',
                'gender'                 => 'female',
                'blood_type'             => 'O-',
                'emergency_contact_name' => 'أبو نور',
                'emergency_contact_phone'=> '0565555999',
            ],
        ];

        // Process each patient separately.
        foreach ($patients as $data) {
            // Create the user record first.
            $userId = DB::table('users')->insertGetId([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'username'   => $data['username'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'dob'        => $data['dob'],
                'password'   => $data['password'],
                // Optional fields for the users table
                'is_active'  => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Create the patient record linked to the user.
            DB::table('patients')->insert([
                'user_id'                 => $userId,
                'id_number'               => $data['id_number'],
                'gender'                  => $data['gender'],
                'blood_type'              => $data['blood_type'],
                'emergency_contact_name'  => $data['emergency_contact_name'],
                'emergency_contact_phone' => $data['emergency_contact_phone'],
                'created_at'              => Carbon::now(),
                'updated_at'              => Carbon::now(),
            ]);
        }
    }
}
