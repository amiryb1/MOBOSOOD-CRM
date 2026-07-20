<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    protected $table = 'archive';

    protected $fillable = [
        'original_product_request_id',
        'product_name',
        'brand',
        'model',
        'color',
        'total_quantity',
        'request_count',
        'customer_count',
        'expected_price',
        'registered_at',
        'fulfilled_at',
        'fulfillment_days',
        'fulfilled_by',
    ];

    protected function casts(): array
    {
        return [
            'registered_at' => 'date',
            'fulfilled_at' => 'date',
        ];
    }

    public function fulfilledBy()
    {
        return $this->belongsTo(User::class, 'fulfilled_by');
    }
}
