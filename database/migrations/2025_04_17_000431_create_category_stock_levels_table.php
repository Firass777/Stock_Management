<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCategoryStockLevelsTable extends Migration
{
    public function up()
    {
        Schema::create('category_stock_levels', function (Blueprint $table) {
            $table->id();
            $table->string('category')->unique();
            $table->integer('min_stock_level');
            $table->integer('max_stock_level');
            $table->timestamps();
        });

        // Insert default categories
        DB::table('category_stock_levels')->insert([
            ['category' => 'Electronics', 'min_stock_level' => 10, 'max_stock_level' => 100],
            ['category' => 'Clothing', 'min_stock_level' => 20, 'max_stock_level' => 200],
            ['category' => 'Food', 'min_stock_level' => 30, 'max_stock_level' => 300],
            ['category' => 'Tools', 'min_stock_level' => 15, 'max_stock_level' => 150],
            ['category' => 'Other', 'min_stock_level' => 5, 'max_stock_level' => 50],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('category_stock_levels');
    }
}