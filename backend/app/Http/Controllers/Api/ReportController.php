<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use App\Models\ProductRequest;
use App\Models\RequestHistory;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $topProducts = ProductRequest::orderByDesc('request_count')->limit(10)
            ->get(['id', 'product_name', 'request_count', 'total_quantity']);

        $topBrands = ProductRequest::select('brand', DB::raw('SUM(request_count) as total'))
            ->whereNotNull('brand')
            ->groupBy('brand')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $topSellers = RequestHistory::select('seller_id', DB::raw('COUNT(*) as total'))
            ->with('seller:id,name')
            ->groupBy('seller_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $lostSalesValue = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])
            ->get()
            ->sum(fn ($p) => $p->total_quantity * (float) $p->expected_price);

        $avgFulfillmentDays = Archive::avg('fulfillment_days');

        $overdueProducts = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])
            ->where('waiting_days', '>', 7)
            ->orderByDesc('waiting_days')
            ->get(['id', 'product_name', 'waiting_days', 'status']);

        return response()->json([
            'top_products' => $topProducts,
            'top_brands' => $topBrands,
            'top_sellers' => $topSellers,
            'lost_sales_value' => $lostSalesValue,
            'average_fulfillment_days' => round($avgFulfillmentDays ?? 0, 1),
            'overdue_products' => $overdueProducts,
        ]);
    }
}
