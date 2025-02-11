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
        Schema::create('doctor_clinic_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Run the migrations.
     * /
     * public function up(): void
     * {
     * Schema::create('doctor_clinic_schedules', function (Blueprint $table) {
     * $table->id();
     * $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
     * $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
     * $table->time('start_time');
     * $table->time('end_time');
     * $table->boolean('available')->default(true);
     * $table->timestamps();
     * });
     * }
     *
     * /**
     * Reverse the migrations.
     * /
     * public function down(): void
     * {
     * Schema::dropIfExists('doctor_clinic_schedules');
     * }
     * };
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_clinic_schedules');
    }
};
