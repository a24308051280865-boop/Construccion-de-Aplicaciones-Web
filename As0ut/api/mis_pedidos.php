<?php

declare(strict_types = 1);

// Dependencies
require_once __DIR__ . '/db.php'; // Database connection and helpers

// Only GET and only logged-in users
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(405, ['success' => false, 'error' => 'Método no permitido.']);
$user = requireLogin();

// Orders of the logged-in user, newest first
$statement = $pdo->prepare(
    'SELECT id_pedido, nombre_receptor, telefono, calle, colonia, ciudad, estado, codigo_postal, referencias, metodo_pago, total, estatus, creado
     FROM pedidos WHERE id_usuario = ? ORDER BY id_pedido DESC'
);
$statement->execute([$user['id']]);
$orders = $statement->fetchAll();

// Attach the items of every order
$lines = $pdo->prepare('SELECT producto_nombre, marca, talla, precio_unitario, cantidad FROM pedido_items WHERE id_pedido = ?');
foreach ($orders as $index => $order) {
    $lines->execute([$order['id_pedido']]);
    $orders[$index]['id_pedido'] = (int) $order['id_pedido'];
    $orders[$index]['total'] = (float) $order['total'];
    $orders[$index]['items'] = array_map(function ($row) {
        $row['precio_unitario'] = (float) $row['precio_unitario'];
        $row['cantidad'] = (int) $row['cantidad'];
        return $row;
    }, $lines->fetchAll());
}

respond(200, ['success' => true, 'pedidos' => $orders]);

?>