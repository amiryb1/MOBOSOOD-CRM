<?php

namespace App\Console\Commands;

use App\Models\Archive;
use App\Models\ProductRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ArchiveFulfilledRequests extends Command
{
    /**
     * اجرا: php artisan requests:archive-fulfilled
     * زمان‌بندی: هر روز ساعت ۰۰:۰۰ (تعریف در routes/console.php)
     */
    protected $signature = 'requests:archive-fulfilled';

    protected $description = 'کالاهای تامین‌شده را آرشیو می‌کند و روزهای انتظار کالاهای باقی‌مانده را افزایش می‌دهد';

    public function handle(): int
    {
        DB::transaction(function () {
            $fulfilled = ProductRequest::where('status', 'fulfilled')->get();

            foreach ($fulfilled as $product) {
                $fulfilledAt = $product->fulfilled_at ?? now();

                Archive::create([
                    'original_product_request_id' => $product->id,
                    'product_name' => $product->product_name,
                    'brand' => $product->brand,
                    'model' => $product->model,
                    'color' => $product->color,
                    'total_quantity' => $product->total_quantity,
                    'request_count' => $product->request_count,
                    'customer_count' => $product->customer_count,
                    'expected_price' => $product->expected_price,
                    'registered_at' => $product->first_request_date,
                    'fulfilled_at' => $fulfilledAt->toDateString(),
                    'fulfillment_days' => $product->first_request_date->diffInDays($fulfilledAt),
                    'fulfilled_by' => $product->fulfilled_by,
                ]);

                $product->delete();
            }

            $this->info("تعداد {$fulfilled->count()} کالا آرشیو شد.");

            // افزایش روزهای انتظار برای کالاهای در حال پیگیری یا تامین‌نشده
            $affected = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])
                ->increment('waiting_days');

            $this->info('روزهای انتظار کالاهای باقی‌مانده بروزرسانی شد.');
        });

        return self::SUCCESS;
    }
}
