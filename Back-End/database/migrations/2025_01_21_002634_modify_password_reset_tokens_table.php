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
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('email')->unique()->primary(); // Add 'user_id' column
            $table->dropColumn('email');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->after('user_id')->primary();

            $table->dropColumn('user_id'); // Remove the 'user_id' column

        });
    }
};
