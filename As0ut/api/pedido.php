<?php
declare(strict_types = 1);
require_once __DIR__ . '/db.php';

// Solo POST y solo usuarios con sesión
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Método no permitido.']);
$user = requireLogin();

// Leer y limpiar los datos del formulario
$data = input();
$brand = (int) ($data['id_marca'] ?? 0);
$garment = trim((string) ($data['prenda'] ?? ''));
$size = trim((string) ($data['talla'] ?? ''));
$quantity = (int) ($data['cantidad'] ?? 0);
$address = trim((string) ($data['direccion'] ?? ''));

// Listas permitidas de prendas y tallas
$garments = ['Playera', 'Camisa', 'Pantalón', 'Sudadera', 'Chamarra', 'Vestido'];
$sizes = ['XS', 'S', 'M', 'L', 'XL'];

// Validaciones
if ($brand <= 0 || $address === '') respond(400, ['success' => false, 'error' => 'Completa todos los campos.']);
if (!in_array($garment, $garments, true) || !in_array($size, $sizes, true)) respond(400, ['success' => false, 'error' => 'Prenda o talla inválida.']);
if ($quantity < 1 || $quantity > 99) respond(400, ['success' => false, 'error' => 'La cantidad debe estar entre 1 y 99.']);

try {

    // Guardar el pedido (la llave foránea valida que la marca exista)
    $statement = $pdo->prepare('INSERT INTO pedidos (id_usuario, id_marca, prenda, talla, cantidad, direccion) VALUES (?, ?, ?, ?, ?, ?)');
    $statement->execute([$user['id'], $brand, $garment, $size, $quantity, $address]);
    respond(201, ['success' => true, 'id' => (int) $pdo->lastInsertId()]);

} catch (PDOException $error) {
    respond(500, ['success' => false, 'error' => 'No se pudo guardar el pedido.']);
}
?>