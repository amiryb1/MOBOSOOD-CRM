<?php

namespace App\Http\Controllers\Api;

use App\Exports\ProductRequestsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function products(Request $request)
    {
        $filters = $request->only(['status', 'search']);

        return Excel::download(
            new ProductRequestsExport($filters),
            'درخواست-های-کالا-'.now()->format('Y-m-d').'.xlsx'
        );
    }
}
