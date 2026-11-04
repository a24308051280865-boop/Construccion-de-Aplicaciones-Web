<?php

// Declaraciones de tipo para verificación de tipos estrictos
declare(strict_types = 1);

// Dependencias Internas
require_once __DIR__ . '/db.php';

// Solo permitir solicitudes POST a este punto final
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Método de solicitud no permitido.']);

// Limitar intentos de inicio de sesión
rateLimit(5, 60);

// Leer y limpiar los datos de entrada
$data = input();
$email = trim((string) ($data['email'] ?? ''));
$password = trim((string) ($data['password'] ?? ''));

// Validar que ambos campos existan
if ($email === '' || $password === '') respond(400, ['success' => false, 'error' => 'Email y contraseña son obligatorios.']);
// Validar el formato del email antes de consultar la base de datos
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(400, ['success' => false, 'error' => 'El email no tiene un formato válido.']);

// Buscar al usuario por correo electrónico
$statement = $pdo->prepare('SELECT id_usuario, nombre, apellido, email, password_hash, activo FROM usuarios WHERE email = ? LIMIT 1');
$statement->execute([$email]);
$user = $statement->fetch();

// Error genérico para no revelar si el correo existe
if (!$user || !password_verify($password, $user['password_hash'])) respond(401, ['success' => false, 'error' => 'Credenciales incorrectas']);

// Los usuarios inactivos no pueden autenticarse
if (!$user['activo']) respond(403, ['success' => false, 'error' => 'Cuenta inactiva. Contacte con soporte.']);

// Guardar al usuario en la sesión (sin el hash) y regenerar el ID de sesión
session_regenerate_id(true);
$_SESSION['user'] = ['id' => (int) $user['id_usuario'], 'nombre' => $user['nombre'], 'apellido' => $user['apellido'], 'email' => $user['email']];

respond(200, ['success' => true, 'user' => $_SESSION['user']]);

?>