<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequestRequest;
use App\Models\Customer;
use App\Models\ProductRequest;
use App\Models\RequestHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductRequestController extends Controller
{
    /**
     * لیست کالاها با امکان جستجو و فیلتر
     */
    public function index(Request $request)
    {
        $query = ProductRequest::query()->with(['fulfilledBy']);

        // فروشنده فقط درخواست‌های خودش را می‌بیند
        if ($request->user()->isSeller()) {
            $query->whereHas('history', function ($q) use ($request) {
                $q->where('seller_id', $request->user()->id);
            });
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhereHas('history.customer', function ($c) use ($search) {
                        $c->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('history.seller', function ($s) use ($search) {
                        $s->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->boolean('today_only')) {
            $query->today();
        }

        if ($request->boolean('urgent_only')) {
            $query->urgent();
        }

        if ($from = $request->query('from_date')) {
            $query->whereDate('first_request_date', '>=', $from);
        }

        if ($to = $request->query('to_date')) {
            $query->whereDate('last_request_date', '<=', $to);
        }

        $products = $query->orderByDesc('last_request_date')->paginate(20);

        return response()->json($products);
    }

    /**
     * ثبت درخواست جدید با منطق ادغام کالای تکراری
     */
    public function store(StoreProductRequestRequest $request)
    {
        $data = $request->validated();

        $signature = ProductRequest::buildSignature(
            $data['product_name'],
            $data['brand'] ?? null,
            $data['model'] ?? null,
            $data['color'] ?? null
        );

        $product = DB::transaction(function () use ($data, $signature, $request) {
            $customer = Customer::firstOrCreate([
                'name' => $data['customer_name'],
                'phone' => $data['customer_phone'] ?? null,
            ]);

            /** @var ProductRequest|null $product */
            $product = ProductRequest::where('product_signature', $signature)->lockForUpdate()->first();

            $isNew = ! $product;

            if ($isNew) {
                $product = ProductRequest::create([
                    'product_name' => $data['product_name'],
                    'brand' => $data['brand'] ?? null,
                    'model' => $data['model'] ?? null,
                    'color' => $data['color'] ?? null,
                    'product_signature' => $signature,
                    'total_quantity' => 0,
                    'request_count' => 0,
                    'customer_count' => 0,
                    'expected_price' => $data['expected_price'] ?? null,
                    'priority' => $data['priority'],
                    'purchase_probability' => $data['purchase_probability'],
                    'status' => 'not_fulfilled',
                    'description' => $data['description'] ?? null,
                    'first_request_date' => now()->toDateString(),
                    'last_request_date' => now()->toDateString(),
                    'waiting_days' => 0,
                ]);
            }

            RequestHistory::create([
                'product_request_id' => $product->id,
                'customer_id' => $customer->id,
                'seller_id' => $request->user()->id,
                'quantity' => $data['quantity'],
                'expected_price' => $data['expected_price'] ?? null,
                'priority' => $data['priority'],
                'purchase_probability' => $data['purchase_probability'],
                'description' => $data['description'] ?? null,
            ]);

            $distinctCustomerCount = RequestHistory::where('product_request_id', $product->id)
                ->distinct('customer_id')
                ->count('customer_id');

            $product->update([
                'total_quantity' => $product->total_quantity + $data['quantity'],
                'request_count' => $product->request_count + 1,
                'customer_count' => $distinctCustomerCount,
                'last_request_date' => now()->toDateString(),
                // بالاترین اولویت درخواست‌شده حفظ می‌شود
                'priority' => $this->higherPriority($product->priority, $data['priority']),
                'expected_price' => $data['expected_price'] ?? $product->expected_price,
                // اگر قبلاً «تامین نشده» بود و درخواست جدید ثبت شد، به «در حال پیگیری» تغییر می‌کند
                'status' => $product->status === 'not_fulfilled' ? 'pending' : $product->status,
            ]);

            return $product->fresh();
        });

        return response()->json($product->load('history.customer', 'history.seller'), 201);
    }

    /**
     * جزئیات کامل یک کالا
     */
    public function show(ProductRequest $productRequest)
    {
        $productRequest->load(['history.customer', 'history.seller', 'fulfilledBy']);

        return response()->json([
            'product' => $productRequest,
            'total_requests' => $productRequest->request_count,
            'customers' => $productRequest->history->pluck('customer')->unique('id')->values(),
            'sellers' => $productRequest->history->pluck('seller')->unique('id')->values(),
            'first_request_date' => $productRequest->first_request_date,
            'last_request_date' => $productRequest->last_request_date,
            'waiting_days' => $productRequest->waiting_days,
        ]);
    }

    /**
     * ویرایش کالا (فقط مدیر)
     */
    public function update(Request $request, ProductRequest $productRequest)
    {
        $data = $request->validate([
            'product_name' => ['sometimes', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:100'],
            'expected_price' => ['nullable', 'numeric', 'min:0'],
            'priority' => ['sometimes', 'in:normal,important,urgent'],
            'purchase_probability' => ['sometimes', 'in:certain,high,medium,low'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $productRequest->update($data);

        return response()->json($productRequest);
    }

    /**
     * تغییر وضعیت کالا (سبز / زرد / قرمز)
     */
    public function updateStatus(Request $request, ProductRequest $productRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:fulfilled,pending,not_fulfilled'],
        ]);

        $payload = ['status' => $data['status']];

        if ($data['status'] === 'fulfilled') {
            $payload['fulfilled_at'] = now();
            $payload['fulfilled_by'] = $request->user()->id;
        }

        $productRequest->update($payload);

        return response()->json($productRequest->fresh());
    }

    /**
     * حذف کالا (فقط مدیر)
     */
    public function destroy(ProductRequest $productRequest)
    {
        $productRequest->delete();

        return response()->json(['message' => 'کالا حذف شد.']);
    }

    private function higherPriority(string $a, string $b): string
    {
        $rank = ['normal' => 1, 'important' => 2, 'urgent' => 3];

        return $rank[$a] >= $rank[$b] ? $a : $b;
    }
}
