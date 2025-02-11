<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppointmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {


        // Additional appointments (using seeded doctors and patients)
        $appointments = [
            [
                'doctor_id'   => 16,
                'patient_id'  => 12,
                'date'        => '2024-11-10',
                'status'      => 'pending',
//                'notes'       => 'فحص دوري',
                'time'        => '10:00:00',
                'visit_type'  => 'locale',
                'clinic_id'   => 17,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'doctor_id'   => 15,
                'patient_id'  => 12,
                'date'        => '2024-11-15',
                'status'      => 'pending',
//                'notes'       => 'إلغاء من قبل المريض',
                'time'        => '11:30:00',
                'visit_type'  => 'locale',
                'clinic_id'   => 15,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'doctor_id'   => 14,
                'patient_id'  => 12,
                'date'        => '2025-01-10',
                'status'      => 'pending',
//                'notes'       => 'مراجعة بخصوص الألم',
                'time'        => '09:00:00',
                'visit_type'  => 'locale',
                'clinic_id'   => 14,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'doctor_id'   => 14,
                'patient_id'  => 12,
                'date'        => '2025-02-20',
                'status'      => 'pending',
//                'notes'       => 'استشارة عامة',
                'time'        => '14:00:00',
                'visit_type'  => 'locale',
                'clinic_id'   => 14,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        DB::table('appointments')->insert($appointments);
    }
}
