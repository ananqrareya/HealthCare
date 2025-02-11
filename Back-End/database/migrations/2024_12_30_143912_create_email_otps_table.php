<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailOtpsTable extends Migration
{
    public function up(): void
    {
        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
            ->constrained('users')
            ->cascadeOnDelete();
            $table->integer('otp');
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
}

