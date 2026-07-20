<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductRequest extends Model
{
    protected $table = 'products_requested';

    protected $fillable = [
        'product_name',
        'brand',
        'model',
        'color',
        'product_signature',
        'total_quantity',
        'request_count',
        'customer_count',
        'expected_price',
        'priority',
        'purchase_probability',
        'status',
        'description',
        'first_request_date',
        'last_request_date',
        'waiting_days',
        'fulfilled_at',
        'fulfilled_by',
    ];

    protected function casts(): array
    {
        return [
            'first_request_date' => 'date',
            'last_request_date' => 'date',
            'fulfilled_at' => 'datetime',
        ];
    }

    /**
     * ساخت امضای یکتا برای تشخیص تکراری بودن کالا (نام + برند + مدل + رنگ)
     */
    public static function buildSignature(string $productName, ?string $brand, ?string $model, ?string $color): string
    {
        $normalize = fn ($v) => Str::of((string) $v)->trim()->lower()->value();

        return md5(implode('|', [
            $normalize($productName),
            $normalize($brand),
            $normalize($model),
            $normalize($color),
        ]));
    }

    public function history()
    {
        return $this->hasMany(RequestHistory::class, 'product_request_id');
    }

    public function fulfilledBy()
    {
        return $this->belongsTo(User::class, 'fulfilled_by');
    }

    // آیا کالا نیاز به اعلان قرمز رنگ دارد؟ (بیش از ۵ درخواست یا بیش از ۷ روز تامین نشده)
    public function getNeedsAlertAttribute(): bool
    {
        return $this->request_count > 5 || ($this->status !== 'fulfilled' && $this->waiting_days > 7);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('last_request_date', now()->toDateString());
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUrgent($query)
    {
        return $query->where('priority', 'urgent');
    }
}
