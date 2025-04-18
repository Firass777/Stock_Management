<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
                'error' => $e->getMessage(),
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
                'error' => $e->getMessage(),
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
                'error' => $e->getMessage(),
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
}