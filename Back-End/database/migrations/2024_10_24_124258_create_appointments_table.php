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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                ->index()
                ->constrained('patients')
                ->cascadeOnDelete();
            $table->foreignId('doctor_id')
                ->index()
                ->constrained('doctors')
                ->cascadeOnDelete();
            $table->foreignId('clinic_id')
                ->nullable()
                ->constrained('clinics')
                ->nullOnDelete();
            $table->date('date');
            $table->time('time');
            $table->enum('visit_type', ['online', 'locale'])->default('locale');
            $table->enum('status', ['completed', 'pending', 'cancelled','missed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
