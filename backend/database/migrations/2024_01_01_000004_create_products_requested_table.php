<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products_requested', function (Blueprint $table) {
            $table->id();

            $table->string('product_name');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();

            // شناسه یکتای منطقی کالا برای تشخیص تکراری بودن (hash از نام+برند+مدل+رنگ)
            $table->string('product_signature')->unique();

            $table->unsignedInteger('total_quantity')->default(0);
            $table->unsignedInteger('request_count')->default(0);
            $table->unsignedInteger('customer_count')->default(0);

            $table->decimal('expected_price', 15, 0)->nullable();

            $table->enum('priority', ['normal', 'important', 'urgent'])->default('normal');
            $table->enum('purchase_probability', ['certain', 'high', 'medium', 'low'])->default('medium');

            // وضعیت: fulfilled (تامین شد) | pending (در حال پیگیری) | not_fulfilled (تامین نشد)
            $table->enum('status', ['fulfilled', 'pending', 'not_fulfilled'])->default('not_fulfilled');

            $table->text('description')->nullable();

            $table->date('first_request_date');
            $table->date('last_request_date');
            $table->unsignedInteger('waiting_days')->default(0);

            $table->timestamp('fulfilled_at')->nullable();
            $table->foreignId('fulfilled_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['status']);
            $table->index(['priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products_requested');
    }
};
