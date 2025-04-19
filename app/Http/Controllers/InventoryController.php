<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\CategoryStockLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);
            $page = $request->query('page', 1);
            $search = $request->query('search');
            $category = $request->query('category');

            $query = Inventory::query();

            if ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
            }

            if ($category) {
                $query->where('category', $category);
            }

            $items = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $items->items(),
                'meta' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch inventory items',
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'quantity' => 'required|integer|min:0',
                'unit_price' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $item = Inventory::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $item,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create inventory item',
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $item = Inventory::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $item,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Item not found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'quantity' => 'required|integer|min:0',
                'unit_price' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $item = Inventory::findOrFail($id);
            $item->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $item,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update inventory item',
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $item = Inventory::findOrFail($id);
            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Item not found',
            ], 404);
        }
    }

    public function dashboardStats()
    {
        try {
            $totalProducts = Inventory::count();
            $categories = Inventory::distinct('category')->count('category');
            
            $lowStockItems = Inventory::join('category_stock_levels', 'inventories.category', '=', 'category_stock_levels.category')
                ->whereColumn('inventories.quantity', '<', 'category_stock_levels.min_stock_level')
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalProducts' => $totalProducts,
                    'categories' => $categories,
                    'lowStockItems' => $lowStockItems,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch dashboard stats: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function stockMovement()
    {
        try {
            $data = Inventory::selectRaw('MONTH(created_at) as month, SUM(quantity) as total')
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(function($item) {
                    return [
                        'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                        'total' => $item->total
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch stock movement data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function categoryDistribution()
    {
        try {
            $data = Inventory::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch category distribution data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function criticalStock()
    {
        try {
            $items = Inventory::join('category_stock_levels', 'inventories.category', '=', 'category_stock_levels.category')
                ->whereColumn('inventories.quantity', '<', 'category_stock_levels.min_stock_level')
                ->select(
                    'inventories.name',
                    'inventories.category',
                    'inventories.quantity',
                    'category_stock_levels.min_stock_level as threshold'
                )
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch critical stock data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function totalQuantity()
    {
        try {
            $totalQuantity = Inventory::sum('quantity');

            return response()->json([
                'success' => true,
                'data' => [
                    'totalQuantity' => $totalQuantity
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch total quantity: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function totalStockValue()
    {
        try {
            $totalValue = Inventory::selectRaw('SUM(quantity * unit_price) as total_value')
                ->first()
                ->total_value;

            return response()->json([
                'success' => true,
                'data' => [
                    'totalStockValue' => $totalValue
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch total stock value: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function inventorySummary()
    {
        try {
            $summary = Inventory::selectRaw('
                COUNT(*) as total_items,
                SUM(quantity) as total_quantity,
                SUM(quantity * unit_price) as total_value,
                COUNT(DISTINCT category) as categories_count
            ')->first();

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch inventory summary: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function inventoryDetails()
    {
        try {
            $details = Inventory::select('name', 'category', 'quantity', 'unit_price')
                ->orderBy('category')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $details
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch inventory details: ' . $e->getMessage(),
            ], 500);
        }
    }
}