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
        Schema::create('bails', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_id');
            $table->foreignId('doctor_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('patient_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('number');
            $table->text('service_details'); // JSON or string for services
            $table->decimal('amount', 10, 2); // Amount field
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bails');
    }
};
