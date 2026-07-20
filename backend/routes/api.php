<?php

use App\Http\Controllers\Api\ArchiveController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\ProductRequestController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // درخواست‌های کالا - قابل دسترس برای مدیر و فروشنده
    Route::get('/product-requests', [ProductRequestController::class, 'index']);
    Route::post('/product-requests', [ProductRequestController::class, 'store']);
    Route::get('/product-requests/{productRequest}', [ProductRequestController::class, 'show']);
    Route::patch('/product-requests/{productRequest}/status', [ProductRequestController::class, 'updateStatus']);

    // فقط مدیر
    Route::middleware('admin')->group(function () {
        Route::put('/product-requests/{productRequest}', [ProductRequestController::class, 'update']);
        Route::delete('/product-requests/{productRequest}', [ProductRequestController::class, 'destroy']);

        Route::get('/archive', [ArchiveController::class, 'index']);
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/export/products', [ExportController::class, 'products']);
    });
});
