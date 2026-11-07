<?php

declare(strict_types = 1);

// Dependencies
require_once __DIR__ . '/db.php'; // Database connection and helpers

// Only POST and only logged-in users
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['success' => false, 'error' => 'Método no permitido.']);
$user = requireLogin();

// Allowed values
$sizes = ['XS', 'S', 'M', 'L', 'XL'];
$methods = ['Efectivo contra entrega', 'Transferencia bancaria', 'Tarjeta al recibir'];

// Read the request
$data = input();
$rawItems = is_array($data['items'] ?? null) ? $data['items'] : [];
$rawShipping = is_array($data['envio'] ?? null) ? $data['envio'] : [];
$payment = trim((string) ($data['metodo_pago'] ?? ''));

/// <summary>Reads one field of an array as trimmed text</summary>
function field(array $source, string $name): string {
    return trim((string) ($source[$name] ?? ''));
}

$shipping = [
    'nombre_receptor' => field($rawShipping, 'nombre_receptor'),
    'telefono'        => preg_replace('/\D/', '', field($rawShipping, 'telefono')),
    'calle'           => field($rawShipping, 'calle'),
    'colonia'         => field($rawShipping, 'colonia'),
    'ciudad'          => field($rawShipping, 'ciudad'),
    'estado'          => field($rawShipping, 'estado'),
    'codigo_postal'   => field($rawShipping, 'codigo_postal'),
    'referencias'     => field($rawShipping, 'referencias')
];

// Validate the delivery data
if (mb_strlen($shipping['nombre_receptor']) < 2 || mb_strlen($shipping['nombre_receptor']) > 100) respond(400, ['success' => false, 'error' => 'Escribe el nombre de quien recibe.']);
if (strlen($shipping['telefono']) !== 10) respond(400, ['success' => false, 'error' => 'El teléfono debe tener 10 dígitos.']);
if (mb_strlen($shipping['calle']) < 3 || mb_strlen($shipping['calle']) > 150) respond(400, ['success' => false, 'error' => 'Escribe la calle y el número.']);
if (mb_strlen($shipping['colonia']) < 2 || mb_strlen($shipping['colonia']) > 100) respond(400, ['success' => false, 'error' => 'Escribe la colonia.']);
if (mb_strlen($shipping['ciudad']) < 2 || mb_strlen($shipping['ciudad']) > 80) respond(400, ['success' => false, 'error' => 'Escribe la ciudad.']);
if (mb_strlen($shipping['estado']) < 2 || mb_strlen($shipping['estado']) > 80) respond(400, ['success' => false, 'error' => 'Escribe el estado.']);
if (!preg_match('/^\d{5}$/', $shipping['codigo_postal'])) respond(400, ['success' => false, 'error' => 'El código postal debe tener 5 dígitos.']);
if (mb_strlen($shipping['referencias']) > 200) respond(400, ['success' => false, 'error' => 'Las referencias son demasiado largas.']);
if (!in_array($payment, $methods, true)) respond(400, ['success' => false, 'error' => 'Elige un método de pago válido.']);

// Validate the cart lines
$lines = [];
foreach ($rawItems as $item) {
    if (!is_array($item)) respond(400, ['success' => false, 'error' => 'Carrito inválido.']);
    $id = (int) ($item['id'] ?? 0);
    $size = trim((string) ($item['talla'] ?? ''));
    $quantity = (int) ($item['cantidad'] ?? 0);
    if ($id <= 0 || !in_array($size, $sizes, true) || $quantity < 1 || $quantity > 99) respond(400, ['success' => false, 'error' => 'Hay un producto inválido en tu carrito.']);
    $lines[] = ['id' => $id, 'talla' => $size, 'cantidad' => $quantity];
}
if (count($lines) === 0 || count($lines) > 30) respond(400, ['success' => false, 'error' => 'Tu carrito está vacío o es demasiado grande.']);

// Load the real name, brand and price of every product from the database
$ids = array_values(array_unique(array_column($lines, 'id')));
$marks = implode(',', array_fill(0, count($ids), '?'));
$statement = $pdo->prepare(
    "SELECT p.id_producto, p.nombre, p.precio, m.nombre AS marca
     FROM productos p JOIN marcas m ON m.id_marca = p.id_marca
     WHERE p.activo = 1 AND p.id_producto IN ($marks)"
);
$statement->execute($ids);
$catalog = [];
foreach ($statement->fetchAll() as $row) $catalog[(int) $row['id_producto']] = $row;

// Every product must still exist; the total is calculated here, never trusted from the browser
$total = 0.0;
foreach ($lines as $line) {
    if (!isset($catalog[$line['id']])) respond(400, ['success' => false, 'error' => 'Un producto de tu carrito ya no está disponible.']);
    $total += (float) $catalog[$line['id']]['precio'] * $line['cantidad'];
}
$total = round($total, 2);

try {

    // Save the order and its items in a single transaction
    $pdo->beginTransaction();

    $statement = $pdo->prepare(
        'INSERT INTO pedidos (id_usuario, nombre_receptor, telefono, calle, colonia, ciudad, estado, codigo_postal, referencias, metodo_pago, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $user['id'],
        $shipping['nombre_receptor'],
        $shipping['telefono'],
        $shipping['calle'],
        $shipping['colonia'],
        $shipping['ciudad'],
        $shipping['estado'],
        $shipping['codigo_postal'],
        $shipping['referencias'],
        $payment,
        $total
    ]);
    $orderId = (int) $pdo->lastInsertId();

    $statement = $pdo->prepare(
        'INSERT INTO pedido_items (id_pedido, id_producto, producto_nombre, marca, talla, precio_unitario, cantidad)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($lines as $line) {
        $product = $catalog[$line['id']];
        $statement->execute([$orderId, $line['id'], $product['nombre'], $product['marca'], $line['talla'], $product['precio'], $line['cantidad']]);
    }

    $pdo->commit();

} catch (PDOException $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    respond(500, ['success' => false, 'error' => 'No se pudo guardar el pedido.']);
}

respond(201, ['success' => true, 'id' => $orderId, 'total' => $total]);

?>