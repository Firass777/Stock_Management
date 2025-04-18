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
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Hammer',
                'category' => 'Tools',
                'quantity' => 30,
                'unit_price' => 15.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Miscellaneous Item',
                'category' => 'Other',
                'quantity' => 25,
                'unit_price' => 9.99,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
    }
};