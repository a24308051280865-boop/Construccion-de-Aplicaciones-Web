<?php
declare(strict_types = 1);
require_once __DIR__ . '/db.php';

// Destruir la sesión actual
$_SESSION = [];
session_destroy();
respond(200, ['success' => true]);
?>