<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryStockLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'min_stock_level',
        'max_stock_level',
    ];

    protected $casts = [
        'min_stock_level' => 'integer',
        'max_stock_level' => 'integer',
    ];
}