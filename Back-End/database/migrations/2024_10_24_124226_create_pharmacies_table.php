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
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->id();
            $table->string('ar_name')->unique();
            $table->string('en_name')->unique();
            $table->string('address');
            $table->string('license_number')->unique();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('city_id')
                ->nullable()
                ->constrained('cities')
                ->nullOnDelete();
            $table->decimal('lat')->nullable();
            $table->decimal('long')->nullable();
            $table->string('pharmacy_phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};
