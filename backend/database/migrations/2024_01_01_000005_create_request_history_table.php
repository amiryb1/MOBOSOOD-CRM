<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('request_history', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_request_id')->constrained('products_requested')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();

            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('expected_price', 15, 0)->nullable();
            $table->enum('priority', ['normal', 'important', 'urgent'])->default('normal');
            $table->enum('purchase_probability', ['certain', 'high', 'medium', 'low'])->default('medium');
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_history');
    }
};
