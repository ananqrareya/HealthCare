<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'role_id' => 1,
            'first_name' => 'صالح',
            'en_first_name' => 'saleh',
            'last_name' => 'زيتاوي',
            'en_last_name' => 'zetawi',
            'username' => 'admin2025',
            'email' => 'salehzetawi15@gmail.com',
            'phone' => '0569522815',
            'is_active' => true,
            'password' => Hash::make('password'),
            'dob' => '2002-12-03',
            'created_at' => now(),
            'updated_at' => now(),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);
    }
}
