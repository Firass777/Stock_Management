<?php

namespace App\Http\Controllers;

use App\Models\CategoryStockLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryStockLevelController extends Controller
{
    public function index()
    {
        try {
            $levels = CategoryStockLevel::all();
            return response()->json([
                'success' => true,
                'data' => $levels,
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
                'category' => 'required|string|unique:category_stock_levels',
                'min_stock_level' => 'required|integer|min:0',
                'max_stock_level' => 'required|integer|min:0|gt:min_stock_level',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $level = CategoryStockLevel::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $level,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'min_stock_level' => 'required|integer|min:0',
                'max_stock_level' => 'required|integer|min:0|gt:min_stock_level',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $level = CategoryStockLevel::findOrFail($id);
            $level->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $level,
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
            $level = CategoryStockLevel::findOrFail($id);
            $level->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category level deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Category level not found',
            ], 404);
        }
    }
}