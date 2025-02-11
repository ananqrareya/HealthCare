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
        Schema::create('medications', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('doctor_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name'); // اسم الدواء
            $table->string('dosage'); // الجرعة
            $table->text('instructions'); // تعليمات الاستخدام
            $table->timestamps(); // Created at & Updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
