<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$products = [
    ["sku" => "ELE-001", "name" => "Keyboard", "category" => "Electronics", "price" => 3500, "quantity" => 20, "status" => "In Stock", "reorderLevel" => 5],
    ["sku" => "ELE-002", "name" => "Wireless Earbuds", "category" => "Electronics", "price" => 3500, "quantity" => 3, "status" => "Low Stock", "reorderLevel" => 5],
    ["sku" => "ACC-001", "name" => "USB-C Cable", "category" => "Accessories", "price" => 450, "quantity" => 50, "status" => "In Stock", "reorderLevel" => 10],
    ["sku" => "ACC-002", "name" => "Laptop Stand", "category" => "Accessories", "price" => 1200, "quantity" => 0, "status" => "Out of Stock", "reorderLevel" => 2],
    ["sku" => "FUR-001", "name" => "Gaming Chair", "category" => "Furniture", "price" => 25000, "quantity" => 2, "status" => "Low Stock", "reorderLevel" => 3],
    ["sku" => "FUR-002", "name" => "Standing Desk", "category" => "Furniture", "price" => 15000, "quantity" => 10, "status" => "In Stock", "reorderLevel" => 2]
];
?>