<?php
session_start();            
include "conexion.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: ../views/login.html");
    exit;
}

$correo   = trim($_POST["correo"] ?? "");
$password = $_POST["password"] ?? "";

$stmt = mysqli_prepare($conexion, "SELECT id, nombre, password FROM usuarios WHERE correo = ?");
mysqli_stmt_bind_param($stmt, "s", $correo);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $nombre, $hash);

if (mysqli_stmt_fetch($stmt) && password_verify($password, $hash)) {
    $_SESSION["id"]     = $id;
    $_SESSION["nombre"] = $nombre;
    $_SESSION["correo"] = $correo;

    header("Location: ../index.html");
    exit;
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Levis - Error</title>
    <link rel="stylesheet" href="../styles/login.css">
</head>
<body>
    <div class="caja">
        <h1>LEVIS</h1>
        <p class="error">Correo o contraseña incorrectos.</p>
        <p><a href="../views/login.html">Volver a intentar</a></p>
        <p><a href="../views/register.html">Crear una cuenta</a></p>
    </div>
</body>
</html>