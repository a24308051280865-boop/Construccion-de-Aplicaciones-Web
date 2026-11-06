<?php

// Declaraciones de tipo para verificación de tipos estrictos
declare(strict_types = 1);

// No mostrar errores de PHP en pantalla: la API siempre debe responder JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Convertir cualquier excepción no capturada en una respuesta JSON
set_exception_handler(function ($error) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error del servidor: ' . $error->getMessage()]);
});

// Iniciar la sesión para guardar al usuario autenticado
session_start();

// Conexión PDO a MySQL (XAMPP: usuario root sin contraseña)
$pdo = new PDO(
    'mysql:host=localhost;port=3306;dbname=as0ut;charset=utf8mb4',
    'root',
    '',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

/**
 * Responde en JSON con un código HTTP y termina la ejecución.
 *
 * @param int $code Código de estado HTTP.
 * @param array $body Cuerpo de la respuesta.
 */
function respond(int $code, array $body) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code($code);
    echo json_encode($body);
    exit;
}

/**
 * Lee el cuerpo JSON de la solicitud.
 *
 * @return array Datos decodificados o matriz vacía.
 */
function input(): array {
    return json_decode((string) file_get_contents('php://input'), true) ?? [];
}

/**
 * Rate limiting simple por IP usando archivos temporales.
 *
 * @param int $max Intentos máximos permitidos.
 * @param int $window Ventana de tiempo en segundos.
 */
function rateLimit(int $max = 5, int $window = 60) {
    $file = sys_get_temp_dir() . '/rl_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $_SERVER['REMOTE_ADDR'] ?? 'x') . '.json';
    $data = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?? []) : [];
    if (!isset($data['n'], $data['t']) || time() - $data['t'] > $window) $data = ['n' => 0, 't' => time()];
    $data['n']++;
    file_put_contents($file, json_encode($data), LOCK_EX);
    if ($data['n'] > $max) respond(429, ['success' => false, 'error' => 'Muchas solicitudes, inténtalo más tarde.']);
}

/**
 * Exige que exista una sesión iniciada.
 *
 * @return array Datos del usuario en sesión.
 */
function requireLogin(): array {
    if (!isset($_SESSION['user'])) respond(401, ['success' => false, 'error' => 'Debes iniciar sesión.']);
    return $_SESSION['user'];
}

?>