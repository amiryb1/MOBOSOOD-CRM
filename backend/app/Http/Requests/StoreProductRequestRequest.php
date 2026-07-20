<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'expected_price' => ['nullable', 'numeric', 'min:0'],
            'priority' => ['required', 'in:normal,important,urgent'],
            'purchase_probability' => ['required', 'in:certain,high,medium,low'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_name.required' => 'نام کالا الزامی است.',
            'quantity.required' => 'تعداد درخواستی الزامی است.',
            'customer_name.required' => 'نام مشتری الزامی است.',
            'priority.in' => 'اولویت انتخاب‌شده نامعتبر است.',
            'purchase_probability.in' => 'احتمال خرید انتخاب‌شده نامعتبر است.',
        ];
    }
}
