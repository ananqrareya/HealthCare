<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['ar_name' => 'غزة', 'en_name' => 'Gaza'],
            ['ar_name' => 'القدس', 'en_name' => 'Jerusalem'],
            ['ar_name' => 'رام الله', 'en_name' => 'Ramallah'],
            ['ar_name' => 'الخليل', 'en_name' => 'Hebron'],
            ['ar_name' => 'بيت لحم', 'en_name' => 'Bethlehem'],
            ['ar_name' => 'نابلس', 'en_name' => 'Nablus'],
            ['ar_name' => 'جنين', 'en_name' => 'Jenin'],
            ['ar_name' => 'طولكرم', 'en_name' => 'Tulkarm'],
            ['ar_name' => 'قلقيلية', 'en_name' => 'Qalqilya'],
            ['ar_name' => 'أريحا', 'en_name' => 'Jericho'],
            ['ar_name' => 'سلفيت', 'en_name' => 'Salfit'],
            ['ar_name' => 'رفح', 'en_name' => 'Rafah'],
            ['ar_name' => 'خان يونس', 'en_name' => 'Khan Younis'],
            ['ar_name' => 'دير البلح', 'en_name' => 'Deir al-Balah'],
            ['ar_name' => 'جباليا', 'en_name' => 'Jabalia'],
            ['ar_name' => 'بيت حانون', 'en_name' => 'Beit Hanoun'],
            ['ar_name' => 'بيت لاهيا', 'en_name' => 'Beit Lahia'],
        ];

        DB::table('cities')->insert($cities);
    }
}
