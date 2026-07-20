<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('archive', function (Blueprint $table) {
            $table->id();

            // ارجاع به رکورد اصلی (برای ردیابی) - رکورد اصلی پس از آرشیو از لیست فعال حذف می‌شود
            $table->unsignedBigInteger('original_product_request_id')->nullable();

            $table->string('product_name');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();

            $table->unsignedInteger('total_quantity')->default(0);
            $table->unsignedInteger('request_count')->default(0);
            $table->unsignedInteger('customer_count')->default(0);
            $table->decimal('expected_price', 15, 0)->nullable();

            $table->date('registered_at');   // تاریخ ثبت (اولین درخواست)
            $table->date('fulfilled_at');    // تاریخ تامین
            $table->unsignedInteger('fulfillment_days'); // مدت زمان تامین

            $table->foreignId('fulfilled_by')->nullable()->constrained('users')->nullOnDelete(); // مسئول خرید

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archive');
    }
};
