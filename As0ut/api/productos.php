<?php

declare(strict_types = 1);

// Dependencies
require_once __DIR__ . '/db.php'; // Database connection and helpers

// Public catalog endpoint: GET only, no login required
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(405, ['success' => false, 'error' => 'Método no permitido.']);

/// <summary>Base query: active products with their brand and category slug</summary>
$base = 'SELECT p.id_producto, p.nombre, p.descripcion, p.precio, m.nombre AS marca, c.slug AS categoria
         FROM productos p
         JOIN marcas m ON m.id_marca = p.id_marca
         JOIN categorias c ON c.id_categoria = p.id_categoria
         WHERE p.activo = 1';

/// <summary>Casts the numeric columns so the JSON has real numbers</summary>
function castRows(array $rows): array {
    return array_map(function ($row) {
        $row['id_producto'] = (int) $row['id_producto'];
        $row['precio'] = (float) $row['precio'];
        return $row;
    }, $rows);
}

// Mode 1: random featured products for the home page
if (isset($_GET['destacados'])) {
    $rows = $pdo->query($base . ' ORDER BY RAND() LIMIT 8')->fetchAll();
    respond(200, ['success' => true, 'productos' => castRows($rows)]);
}

// Mode 2: products by id (the cart uses it to refresh the prices)
if (isset($_GET['ids'])) {
    $ids = array_values(array_unique(array_filter(array_map('intval', explode(',', (string) $_GET['ids'])))));
    if (count($ids) === 0 || count($ids) > 50) respond(200, ['success' => true, 'productos' => []]);
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $statement = $pdo->prepare($base . " AND p.id_producto IN ($marks)");
    $statement->execute($ids);
    respond(200, ['success' => true, 'productos' => castRows($statement->fetchAll())]);
}

// Mode 3: all the products of one category
$slug = trim((string) ($_GET['categoria'] ?? ''));
if ($slug === '') respond(400, ['success' => false, 'error' => 'Falta la categoría.']);

$statement = $pdo->prepare('SELECT id_categoria, nombre, slug, descripcion FROM categorias WHERE slug = ? LIMIT 1');
$statement->execute([$slug]);
$category = $statement->fetch();
if (!$category) respond(404, ['success' => false, 'error' => 'La categoría no existe.']);

$statement = $pdo->prepare($base . ' AND p.id_categoria = ? ORDER BY p.nombre');
$statement->execute([$category['id_categoria']]);

respond(200, ['success' => true, 'categoria' => $category, 'productos' => castRows($statement->fetchAll())]);

?>