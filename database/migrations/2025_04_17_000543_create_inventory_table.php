<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->integer('quantity');
            $table->decimal('unit_price', 8, 2);
            $table->timestamps();
        });

        // Insert default inventory items
        DB::table('inventories')->insert([
            [
                'name' => 'Smartphone',
                'category' => 'Electronics',
                'quantity' => 50,
                'unit_price' => 599.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'T-Shirt',
                'category' => 'Clothing',
                'quantity' => 100,
                'unit_price' => 19.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Canned Soup',
                'category' => 'Food',
                'quantity' => 200,
                'unit_price' => 2.49,
                'created_at' => '2025-03-15 10:00:00',
                'updated_at' => '2025-03-15 10:00:00'
            ],
            [
                'name' => 'Hammer',
                'category' => 'Tools',
                'quantity' => 30,
                'unit_price' => 15.99,
                'created_at' => '2025-02-20 14:30:00',
                'updated_at' => '2025-02-20 14:30:00'
            ],
            [
                'name' => 'Miscellaneous Item',
                'category' => 'Other',
                'quantity' => 25,
                'unit_price' => 9.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Laptop',
                'category' => 'Electronics',
                'quantity' => 20,
                'unit_price' => 999.99,
                'created_at' => '2025-01-10 09:15:00',
                'updated_at' => '2025-01-10 09:15:00'
            ],
            [
                'name' => 'Jeans',
                'category' => 'Clothing',
                'quantity' => 75,
                'unit_price' => 49.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Cereal',
                'category' => 'Food',
                'quantity' => 150,
                'unit_price' => 4.99,
                'created_at' => '2025-04-01 12:00:00',
                'updated_at' => '2025-04-01 12:00:00'
            ],
            [
                'name' => 'Screwdriver Set',
                'category' => 'Tools',
                'quantity' => 40,
                'unit_price' => 29.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Notebook',
                'category' => 'Stationery',
                'quantity' => 100,
                'unit_price' => 3.49,
                'created_at' => '2024-12-25 08:45:00',
                'updated_at' => '2024-12-25 08:45:00'
            ],
            [
                'name' => 'Headphones',
                'category' => 'Electronics',
                'quantity' => 60,
                'unit_price' => 79.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Jacket',
                'category' => 'Clothing',
                'quantity' => 45,
                'unit_price' => 89.99,
                'created_at' => '2025-03-01 11:20:00',
                'updated_at' => '2025-03-01 11:20:00'
            ],
            [
                'name' => 'Pasta',
                'category' => 'Food',
                'quantity' => 120,
                'unit_price' => 1.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Drill',
                'category' => 'Electronics',
                'quantity' => 15,
                'unit_price' => 129.99,
                'created_at' => '2025-02-10 16:00:00',
                'updated_at' => '2025-02-10 16:00:00'
            ],
            [
                'name' => 'Pen Set',
                'category' => 'Stationery',
                'quantity' => 200,
                'unit_price' => 5.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tablet',
                'category' => 'Electronics',
                'quantity' => 30,
                'unit_price' => 349.99,
                'created_at' => '2025-04-10 13:30:00',
                'updated_at' => '2025-04-10 13:30:00'
            ],
            [
                'name' => 'Socks',
                'category' => 'Clothing',
                'quantity' => 150,
                'unit_price' => 9.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Rice',
                'category' => 'Food',
                'quantity' => 80,
                'unit_price' => 6.49,
                'created_at' => '2025-03-20 10:10:00',
                'updated_at' => '2025-03-20 10:10:00'
            ],
            [
                'name' => 'Wrench',
                'category' => 'Tools',
                'quantity' => 25,
                'unit_price' => 19.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Sticky Notes',
                'category' => 'Stationery',
                'quantity' => 300,
                'unit_price' => 2.99,
                'created_at' => '2025-01-15 14:45:00',
                'updated_at' => '2025-01-15 14:45:00'
            ]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
    }
};