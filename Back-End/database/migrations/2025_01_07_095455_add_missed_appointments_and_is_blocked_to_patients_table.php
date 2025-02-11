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
        Schema::table('patients', function (Blueprint $table) {
            $table->integer('missed_appointments')->default(0);
            $table->boolean('is_blocked')->default(false);
            $table->integer('rating')->default(5);
            $table->date('blocked_until')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['missed_appointments', 'is_blocked','rating']);
        });
    }
};
