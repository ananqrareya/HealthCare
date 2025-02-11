<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['ar_name' => 'أسنان', 'en_name' => 'Dentistry'],
            ['ar_name' => 'أطفال', 'en_name' => 'Pediatrics'],
            ['ar_name' => 'نساء وولادة', 'en_name' => 'Gynecology and Obstetrics'],
            ['ar_name' => 'جلدية', 'en_name' => 'Dermatology'],
            ['ar_name' => 'باطنة', 'en_name' => 'Internal Medicine'],
            ['ar_name' => 'عيون', 'en_name' => 'Ophthalmology'],
            ['ar_name' => 'أنف وأذن وحنجرة', 'en_name' => 'ENT (Ear, Nose, and Throat)'],
            ['ar_name' => 'عظام', 'en_name' => 'Orthopedics'],
            ['ar_name' => 'قلب', 'en_name' => 'Cardiology'],
            ['ar_name' => 'جراحة', 'en_name' => 'Surgery'],
            ['ar_name' => 'تخدير', 'en_name' => 'Anesthesiology'],
        ];

        DB::table('categories')->insert($categories);
    }
}
