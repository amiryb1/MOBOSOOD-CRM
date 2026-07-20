<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// اجرای خودکار هر روز ساعت ۰۰:۰۰ - آرشیو کالاهای تامین‌شده + افزایش روزهای انتظار
Schedule::command('requests:archive-fulfilled')
    ->dailyAt('00:00')
    ->timezone('Asia/Tehran')
    ->withoutOverlapping();
