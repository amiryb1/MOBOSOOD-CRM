<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use App\Models\ProductRequest;
use App\Models\RequestHistory;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $pendingCount = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])->count();

        $fulfilledToday = ProductRequest::whereDate('fulfilled_at', $today)->count()
            + Archive::whereDate('fulfilled_at', $today)->count();

        $requestsToday = RequestHistory::whereDate('created_at', $today)->count();

        // ارزش تقریبی فروش از دست رفته: مجموع (تعداد کل × قیمت مورد انتظار) کالاهای تامین‌نشده
        $lostSalesValue = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])
            ->get()
            ->sum(fn ($p) => $p->total_quantity * (float) $p->expected_price);

        $mostRequested = ProductRequest::orderByDesc('request_count')->first();

        $alerts = ProductRequest::whereIn('status', ['pending', 'not_fulfilled'])
            ->get()
            ->filter(fn ($p) => $p->needs_alert)
            ->values();

        $dailyChart = RequestHistory::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total')
        )
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => [
                'pending_count' => $pendingCount,
                'fulfilled_today' => $fulfilledToday,
                'requests_today' => $requestsToday,
                'lost_sales_value' => $lostSalesValue,
                'most_requested_product' => $mostRequested?->product_name,
                'most_requested_count' => $mostRequested?->request_count ?? 0,
            ],
            'daily_chart' => $dailyChart,
            'alerts' => $alerts->map(fn ($p) => [
                'id' => $p->id,
                'product_name' => $p->product_name,
                'request_count' => $p->request_count,
                'waiting_days' => $p->waiting_days,
            ]),
        ]);
    }
}
