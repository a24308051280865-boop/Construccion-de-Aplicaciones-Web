<?php
declare(strict_types = 1);
require_once __DIR__ . '/db.php';

// Public catalog endpoint: GET only, no login required
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(405, ['success' => false, 'error' => 'Método no permitido.']);

$slug = trim((string) ($_GET['categoria'] ?? ''));
if ($slug === '') respond(400, ['success' => false, 'error' => 'Falta la categoría.']);

// Find the category by its slug
$statement = $pdo->prepare('SELECT id_categoria, nombre, slug, descripcion FROM categorias WHERE slug = ? LIMIT 1');
$statement->execute([$slug]);
$category = $statement->fetch();
if (!$category) respond(404, ['success' => false, 'error' => 'La categoría no existe.']);

// Active products of that category with their brand name
$statement = $pdo->prepare(
    'SELECT p.id_producto, p.nombre, p.descripcion, p.precio, m.nombre AS marca
     FROM productos p JOIN marcas m ON m.id_marca = p.id_marca
     WHERE p.id_categoria = ? AND p.activo = 1
     ORDER BY p.nombre'
);
$statement->execute([$category['id_categoria']]);
$products = array_map(function ($row) {
    $row['precio'] = (float) $row['precio'];
    return $row;
}, $statement->fetchAll());

respond(200, ['success' => true, 'categoria' => $category, 'productos' => $products]);
?>
