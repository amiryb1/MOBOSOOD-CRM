<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestHistory extends Model
{
    protected $table = 'request_history';

    protected $fillable = [
        'product_request_id',
        'customer_id',
        'seller_id',
        'quantity',
        'expected_price',
        'priority',
        'purchase_probability',
        'description',
    ];

    public function product()
    {
        return $this->belongsTo(ProductRequest::class, 'product_request_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
