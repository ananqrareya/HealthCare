<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DoctorsTableSeeder extends Seeder
{

    public function run()
    {
        // An array of doctors' data including user details.
        $doctors = [
            [
                // User table fields
                'first_name' => 'أحمد',
                'last_name' => 'النجار',
                'username' => 'ahmad_alnajar',
                'email' => 'ahmad@najar.com',
                'phone' => '0591111222',
                'dob' => '1985-06-15',
                'password' => Hash::make('password'),
                // Doctor table fields
                'id_number' => '12345678901',
                'speciality' => 'طب عام',
            ],
            [
                'first_name' => 'سارة',
                'last_name' => 'الخطيب',
                'username' => 'sara_alkhatib',
                'email' => 'sara@clinic.ps',
                'phone' => '0592222333',
                'dob' => '1990-08-20',
                'password' => Hash::make('password'),
                'id_number' => '22334455667',
                'speciality' => 'طب أسنان',
            ],
            [
                'first_name' => 'مريم',
                'last_name' => 'عبدالله',
                'username' => 'mariam_abb',
                'email' => 'mariam@health.ps',
                'phone' => '0593333444',
                'dob' => '1988-04-10',
                'password' => Hash::make('password'),
                'id_number' => '33445566778',
                'speciality' => 'جراحة عامة',
            ],
            [
                'first_name' => 'فاطمة',
                'last_name' => 'الخليل',
                'username' => 'fatima_khaleel',
                'email' => 'fatima@med.ps',
                'phone' => '0594444555',
                'dob' => '1992-11-05',
                'password' => Hash::make('password'),
                'id_number' => '44556677889',
                'speciality' => 'طب أطفال',
            ],
        ];

        foreach ($doctors as $data) {
            // Create the user record first in the users table.
            // Adjust the fields to match your users table migration.
            $userId = DB::table('users')->insertGetId([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'dob' => $data['dob'],
                'password' => $data['password'],
                // Optional fields based on your users table
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Create the doctor record associated with the user.
            DB::table('doctors')->insert([
                'user_id' => $userId,
                'id_number' => $data['id_number'],
                'speciality' => $data['speciality'],
                // If you have additional doctor-specific fields, set them here.
                'available' => true,
                'about' => null,
                'online_active' => false,
                'fee' => 0,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
