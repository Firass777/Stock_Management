<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CategoryStockLevelController;


Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout']);


Route::get('/users', [UsersController::class, 'index']);
Route::post('/users', [UsersController::class, 'store']);
Route::get('/users/{id}', [UsersController::class, 'show']);
Route::put('/users/{id}', [UsersController::class, 'update']);
Route::delete('/users/{id}', [UsersController::class, 'destroy']);
Route::get('/users/search', [UsersController::class, 'search']);


Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::get('/inventory/{id}', [InventoryController::class, 'show']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

Route::get('/category-levels', [CategoryStockLevelController::class, 'index']);
Route::post('/category-levels', [CategoryStockLevelController::class, 'store']);
Route::put('/category-levels/{id}', [CategoryStockLevelController::class, 'update']);
Route::delete('/category-levels/{id}', [CategoryStockLevelController::class, 'destroy']);