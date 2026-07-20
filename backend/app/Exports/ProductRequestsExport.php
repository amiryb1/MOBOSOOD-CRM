<?php

namespace App\Exports;

use App\Models\ProductRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductRequestsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private array $filters = [])
    {
    }

    public function collection()
    {
        $query = ProductRequest::query();

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['search'])) {
            $query->where('product_name', 'like', '%'.$this->filters['search'].'%');
        }

        return $query->orderByDesc('last_request_date')->get();
    }

    public function headings(): array
    {
        return [
            'نام کالا', 'برند', 'مدل', 'رنگ', 'تعداد کل درخواستی',
            'تعداد درخواست', 'تعداد مشتریان', 'قیمت مورد انتظار',
            'اولویت', 'احتمال خرید', 'وضعیت', 'تاریخ اولین درخواست',
            'تاریخ آخرین درخواست', 'روزهای انتظار',
        ];
    }

    private array $priorityLabels = [
        'normal' => 'عادی', 'important' => 'مهم', 'urgent' => 'فوری',
    ];

    private array $probabilityLabels = [
        'certain' => 'قطعی', 'high' => 'زیاد', 'medium' => 'متوسط', 'low' => 'کم',
    ];

    private array $statusLabels = [
        'fulfilled' => 'تامین شد', 'pending' => 'در حال پیگیری', 'not_fulfilled' => 'تامین نشد',
    ];

    public function map($product): array
    {
        return [
            $product->product_name,
            $product->brand,
            $product->model,
            $product->color,
            $product->total_quantity,
            $product->request_count,
            $product->customer_count,
            $product->expected_price,
            $this->priorityLabels[$product->priority] ?? $product->priority,
            $this->probabilityLabels[$product->purchase_probability] ?? $product->purchase_probability,
            $this->statusLabels[$product->status] ?? $product->status,
            $product->first_request_date?->format('Y-m-d'),
            $product->last_request_date?->format('Y-m-d'),
            $product->waiting_days,
        ];
    }
}
