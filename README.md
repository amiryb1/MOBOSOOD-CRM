# سامانه مدیریت درخواست خرید کالاهای ناموجود

پیاده‌سازی Production-Ready با Laravel 12 (API) و React + Vite + TailwindCSS (RTL/فارسی).

## ساختار پروژه

```
backend/    # Laravel 12 API (Sanctum, MySQL)
frontend/   # React + Vite + Tailwind (RTL, دارک مود، Vazirmatn)
```

## راه‌اندازی بک‌اند (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# اطلاعات دیتابیس MySQL را در .env تنظیم کنید
php artisan migrate
php artisan db:seed          # ایجاد کاربر مدیر و فروشنده نمونه
php artisan serve            # http://localhost:8000
```

کاربران نمونه پس از seed:
- مدیر: `admin@example.com` / `password`
- فروشنده: `seller@example.com` / `password`

### اجرای زمان‌بند (آرشیو خودکار ساعت ۰۰:۰۰)

در سرور واقعی، این خط را در crontab اضافه کنید:

```bash
* * * * * cd /path-to-backend && php artisan schedule:run >> /dev/null 2>&1
```

برای تست دستی:

```bash
php artisan requests:archive-fulfilled
```

### نصب پکیج خروجی اکسل

پکیج `maatwebsite/excel` در composer.json اضافه شده و پس از `composer install` آماده است.

## راه‌اندازی فرانت‌اند (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                  # http://localhost:5173
```

## معماری داده (منطق ادغام کالای تکراری)

- هر کالا بر اساس ترکیب «نام + برند + مدل + رنگ» یک امضای یکتا (`product_signature`) می‌گیرد.
- ثبت درخواست جدید برای همان کالا رکورد تازه نمی‌سازد؛ فقط `request_count`، `total_quantity`، `customer_count` و `last_request_date` را بروزرسانی و یک رکورد در `request_history` اضافه می‌کند.
- با تغییر وضعیت به «تامین شد»، کالا در جدول اصلی می‌ماند تا فرآیند شبانه آن را به `archive` منتقل و از لیست اصلی حذف کند.
- کالاهای «در حال پیگیری» و «تامین‌نشده» هر شب یک روز به `waiting_days` آن‌ها اضافه می‌شود.

## جداول دیتابیس

| جدول | توضیح |
|---|---|
| `users` | کاربران با نقش `admin` یا `seller` |
| `customers` | مشتریان |
| `products_requested` | کالاهای درخواستی فعال (یک ردیف برای هر کالای یکتا) |
| `request_history` | سابقه تک‌تک درخواست‌ها (کالا + مشتری + فروشنده) |
| `archive` | کالاهای تامین‌شده و آرشیو شده |

## نکات فنی

- احراز هویت با Laravel Sanctum (توکن Bearer).
- دسترسی مدیر با میدلور `admin` محافظت می‌شود (ویرایش/حذف/آرشیو/گزارشات/خروجی اکسل).
- فروشنده فقط درخواست‌های ثبت‌شده توسط خودش را می‌بیند.
- طراحی کاملاً Responsive با Tailwind، پشتیبانی از حالت تاریک/روشن و فونت Vazirmatn.
