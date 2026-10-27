<?php
declare(strict_types = 1);
require_once __DIR__ . '/db.php';

// Solo usuarios con sesión
requireLogin();

// Obtener todas las marcas de ropa
$marcas = $pdo->query('SELECT id_marca, nombre FROM marcas ORDER BY nombre')->fetchAll();
respond(200, ['success' => true, 'marcas' => $marcas]);
?>