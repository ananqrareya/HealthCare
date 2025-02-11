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
            Schema::create('doctors', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('id_number')->unique();
                $table->string('speciality')->nullable();
                $table->boolean('available')->default(true);
                $table->string('about')->nullable();
                $table->boolean('online_active')->default(false);
                $table->integer('fee')->default(0);
                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('doctors');
        }
    };
