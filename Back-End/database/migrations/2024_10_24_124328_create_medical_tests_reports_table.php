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
        Schema::create('medical_tests_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients');
            $table->string('test_name', 255);
            $table->date('date');
            $table->text('result')->nullable();
            $table->json('ReportDetails')->nullable();
            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('doctors')
                ->nullOnDelete()
            ;
            $table->foreignId('lab_id')
                ->nullable()
                ->constrained('laboratories')
                ->nullOnDelete()
            ;
            $table->enum('status',['completed']); // TODO
            $table->string('report_File_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_tests_reports');
    }
};
