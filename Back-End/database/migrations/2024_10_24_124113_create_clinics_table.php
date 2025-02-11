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
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->cascadeOnDelete();
            $table->foreignId('specialist_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();
            $table->foreignId('city_id')
                ->nullable()
                ->constrained('cities')
                ->nullOnDelete();
            $table->string('clinic_id')->unique();
            $table->string('ar_name');
            $table->string('en_name');
            $table->string('appointment_time')->nullable();
            $table->json('address');
            $table->json('details')->nullable();
            $table->decimal('lat')->nullable();
            $table->decimal('long')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};
