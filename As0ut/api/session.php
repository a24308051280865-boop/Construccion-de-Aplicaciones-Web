<?php
declare(strict_types = 1);
require_once __DIR__ . '/db.php';

// Indica al frontend si hay una sesión activa
respond(200, ['logged' => isset($_SESSION['user']), 'user' => $_SESSION['user'] ?? null]);
?>