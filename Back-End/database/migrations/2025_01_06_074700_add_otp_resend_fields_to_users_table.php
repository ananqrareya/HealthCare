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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('email_otp_resend_count')->default(0)->after('email_verified_at');
            $table->timestamp('email_otp_last_sent_at')->nullable()->after('email_otp_resend_count');
            $table->integer('phone_otp_resend_count')->default(0)->after('phone_verified_at');
            $table->timestamp('phone_otp_last_sent_at')->nullable()->after('phone_otp_resend_count');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_otp_resend_count', 'email_otp_last_sent_at','phone_otp_resend_count','phone_otp_last_sent_at']); // Remove fields

        });
    }
};
