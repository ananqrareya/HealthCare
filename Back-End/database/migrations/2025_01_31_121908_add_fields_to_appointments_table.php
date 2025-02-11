<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {

            $table->json('another_files')->nullable();
            $table->json('patient_note')->nullable();
            $table->json('quick_note')->nullable();
            $table->json('appointment_note')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['another_files', 'patient_note', 'quick_note', 'appointment_note']);
        });
    }
};
