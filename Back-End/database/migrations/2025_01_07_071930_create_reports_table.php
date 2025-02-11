<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')
                ->nullable()
                ->constrained('appointments')
                ->nullOnDelete();
            $table->string('file_path');
            $table->string('public_id');
            $table->date('date');
            $table->timestamps();

        });
    }


    public function down()
    {
        Schema::dropIfExists('reports');
    }


};
