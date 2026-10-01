<?php
require_once 'db.php';

$cat = isset($_GET['cat']) ? $_GET['cat'] : 'ALL';
$stat = isset($_GET['stat']) ? $_GET['stat'] : 'ALL';
$query = isset($_GET['query']) ? strtolower(trim($_GET['query'])) : '';

$filteredProducts = array_filter($products, function($item) use ($cat, $stat, $query) {
    $matchesCategory = ($cat === 'ALL' || $item['category'] === $cat);
    $matchesStatus = ($stat === 'ALL' || $item['status'] === $stat);
    $matchesQuery = ($query === '' || strpos(strtolower($item['name']), $query) !== false || strpos(strtolower($item['sku']), $query) !== false);
    
    return $matchesCategory && $matchesStatus && $matchesQuery;
});

echo json_encode(array_values($filteredProducts));
?>