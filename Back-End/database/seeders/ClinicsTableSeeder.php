<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClinicsTableSeeder extends Seeder
{
    public function run()
    {


        // Additional clinics for other doctors
        // Assume:
        // - Doctor with id 1 (or the first inserted doctor) gets 1 clinic,
        // - Doctor with id corresponding to the second inserted gets 2 clinics,
        // - etc.
        // Adjust doctor ids as needed.

        // For demonstration, we assume:
        // - Doctor id 11 already has one clinic (from above).
        // - Doctor with id = 1 (from the next inserted in DoctorsTableSeeder) gets 1 clinic.
        // - Two other doctors get 2 clinics each.

        DB::table('clinics')->insert([
            // Clinic for doctor with id 1 (assuming id = 1 exists)
            [
                'doctor_id'      => 14,
                'clinic_id'      => '2001001',
                'specialist_id'  => 3,
                'en_name'        => 'Al-Quds Clinic',
                'ar_name'        => 'عيادة القدس',
                'appointment_time'=> 20,
                'lat'            => 31.78,
                'long'           => 35.22,
                'city_id'        => 2, // Jerusalem
                'address'        => json_encode([
                    "address_line_1" => "شارع الوحدة",
                    "address_line_2" => "مبنى الزمزم",
                    "address_line_3" => "الطابق الثاني",
                ]),
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            // Two clinics for doctor with id 2
            [
                'doctor_id'      => 15,
                'clinic_id'      => '3002002',
                'specialist_id'  => 4,
                'en_name'        => 'Ramallah Clinic',
                'ar_name'        => 'عيادة رام الله',
                'appointment_time'=> 15,
                'lat'            => 32.01,
                'long'           => 35.20,
                'city_id'        => 3, // Ramallah
                'address'        => json_encode([
                    "address_line_1" => "شارع الحرية",
                    "address_line_2" => "مجمع الصحة",
                    "address_line_3" => "طابق أول",
                ]),
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'doctor_id'      => 15,
                'clinic_id'      => '3002003',
                'specialist_id'  => 16,
                'en_name'        => 'Nablus Pediatrics',
                'ar_name'        => 'عيادة نابلس للأطفال',
                'appointment_time'=> 10,
                'lat'            => 32.22,
                'long'           => 35.30,
                'city_id'        => 6, // Nablus
                'address'        => json_encode([
                    "address_line_1" => "شارع الأطفال",
                    "address_line_2" => "مجمع الرعاية",
                    "address_line_3" => "الطابق الثالث",
                ]),
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            // Two clinics for doctor with id 3
            [
                'doctor_id'      => 16,
                'clinic_id'      => '4003001',
                'specialist_id'  => 7,
                'en_name'        => 'Hebron ENT Clinic',
                'ar_name'        => 'عيادة أنف وأذن - الخليل',
                'appointment_time'=> 25,
                'lat'            => 31.53,
                'long'           => 35.08,
                'city_id'        => 4, // Hebron
                'address'        => json_encode([
                    "address_line_1" => "شارع المستشفى",
                    "address_line_2" => "عمارة السلام",
                    "address_line_3" => "الطابق الرابع",
                ]),
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'doctor_id'      => 17,
                'clinic_id'      => '4003002',
                'specialist_id'  => 9,
                'en_name'        => 'Jabalia Cardiology',
                'ar_name'        => 'عيادة القلب - جباليا',
                'appointment_time'=> 30,
                'lat'            => 32.10,
                'long'           => 35.00,
                'city_id'        => 15, // Jabalia
                'address'        => json_encode([
                    "address_line_1" => "شارع الطبية",
                    "address_line_2" => "مجمع القلب",
                    "address_line_3" => "الطابق الخامس",
                ]),
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
