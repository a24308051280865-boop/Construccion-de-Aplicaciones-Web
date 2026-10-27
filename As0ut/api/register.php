<?php

// Declaraciones de tipo para verificación de tipos estrictos
declare(strict_types = 1);

// Dependencias Internas
require_once __DIR__ . '/db.php';

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Método no permitido.']);

// Limitar intentos de registro
rateLimit(5, 60);

// Leer y limpiar los datos de entrada
$data = input();
$firstName = trim((string) ($data['firstName'] ?? ''));
$surname = trim((string) ($data['lastName'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$password = trim((string) ($data['password'] ?? ''));

// Validar campos obligatorios
if ($firstName === '' || $surname === '' || $email === '' || $password === '') respond(400, ['success' => false, 'error' => 'Todos los campos son obligatorios.']);

// Validar nombre y apellido: solo letras, entre 2 y 60 caracteres
$namePattern = "/^[\p{L}' ]{2,60}$/u";
if (!preg_match($namePattern, $firstName) || !preg_match($namePattern, $surname)) respond(400, ['success' => false, 'error' => 'El nombre y el apellido solo pueden tener letras (2 a 60 caracteres).']);

// Validar formato y longitud del email
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) respond(400, ['success' => false, 'error' => 'El email no tiene un formato válido.']);

// Validar contraseña: mínimo 8 caracteres con letras y números
if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/\d/', $password)) respond(400, ['success' => false, 'error' => 'La contraseña debe tener mínimo 8 caracteres, con letras y números.']);

// Aplicar hash bcrypt a la contraseña
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

try {

    // Insertar el nuevo usuario (activo = 1)
    $statement = $pdo->prepare('INSERT INTO usuarios (nombre, apellido, email, password_hash, activo) VALUES (?, ?, ?, ?, 1)');
    $statement->execute([$firstName, $surname, $email, $hash]);

} catch (PDOException $error) {

    // Correo duplicado -> 409 Conflicto; cualquier otro error -> 500
    if ($error->getCode() === '23000') respond(409, ['success' => false, 'error' => 'Este correo electrónico ya está registrado.']);
    respond(500, ['success' => false, 'error' => 'Ocurrió un error inesperado.']);

}

// Iniciar sesión automáticamente con la cuenta recién creada
session_regenerate_id(true);
$_SESSION['user'] = ['id' => (int) $pdo->lastInsertId(), 'nombre' => $firstName, 'apellido' => $surname, 'email' => $email];

respond(201, ['success' => true, 'user' => $_SESSION['user']]);

?>