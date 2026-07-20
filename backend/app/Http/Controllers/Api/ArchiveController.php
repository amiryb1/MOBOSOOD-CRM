<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use Illuminate\Http\Request;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        $query = Archive::query()->with('fulfilledBy');

        if ($search = $request->query('search')) {
            $query->where('product_name', 'like', "%{$search}%")
                ->orWhere('brand', 'like', "%{$search}%");
        }

        if ($from = $request->query('from_date')) {
            $query->whereDate('fulfilled_at', '>=', $from);
        }

        if ($to = $request->query('to_date')) {
            $query->whereDate('fulfilled_at', '<=', $to);
        }

        return response()->json(
            $query->orderByDesc('fulfilled_at')->paginate(20)
        );
    }
}
