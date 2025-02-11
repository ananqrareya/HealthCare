<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DoctorRatingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Provided rating for doctor 11
        DB::table('doctors_ratings')->insert([
            [
                'patient_id' => 12,
                'doctor_id'  => 14,
                'rating'     => 3,
                'review'     => 'good meeting',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Two additional ratings for doctor 11
            [
                'patient_id' => 12,
                'doctor_id'  => 14,
                'rating'     => 4,
                'review'     => 'Very professional and caring',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 15,
                'rating'     => 5,
                'review'     => 'Excellent expertise',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Additional ratings for other doctors.
        // For each doctor (doctor_id: 1,2,3,4,5) we add two ratings
        $additionalRatings = [
            // For doctor with id 1
            [
                'patient_id' => 12,
                'doctor_id'  => 16,
                'rating'     => 5,
                'review'     => 'Excellent service',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 17,
                'rating'     => 4,
                'review'     => 'Very friendly and attentive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // For doctor with id 2
            [
                'patient_id' => 12,
                'doctor_id'  => 16,
                'rating'     => 5,
                'review'     => 'Great expertise',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 15,
                'rating'     => 3,
                'review'     => 'Could be more attentive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // For doctor with id 3
            [
                'patient_id' => 12,
                'doctor_id'  => 15,
                'rating'     => 5,
                'review'     => 'Outstanding performance',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 15,
                'rating'     => 5,
                'review'     => 'Highly recommended',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // For doctor with id 4
            [
                'patient_id' => 12,
                'doctor_id'  => 14,
                'rating'     => 4,
                'review'     => 'Very knowledgeable',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 17,
                'rating'     => 4,
                'review'     => 'Friendly and efficient',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // For doctor with id 5
            [
                'patient_id' => 12,
                'doctor_id'  => 17,
                'rating'     => 3,
                'review'     => 'Average experience',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 12,
                'doctor_id'  => 15,
                'rating'     => 2,
                'review'     => 'Needs improvement in bedside manner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('doctors_ratings')->insert($additionalRatings);
    }
}
