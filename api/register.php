<?php
session_start();            
include "conexion.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: ../views/register.html");
    exit;
}

$nombre    = trim($_POST["nombre"] ?? "");
$correo    = trim($_POST["correo"] ?? "");
$password  = $_POST["password"] ?? "";
$confirmar = $_POST["confirmar"] ?? "";

$mensaje = "";

if ($nombre == "" || $correo == "" || $password == "") {
    $mensaje = "Llena todos los campos.";

} elseif ($password != $confirmar) {
    $mensaje = "Las contraseñas no coinciden.";

} else {
    $stmt = mysqli_prepare($conexion, "SELECT id FROM usuarios WHERE correo = ?");
    mysqli_stmt_bind_param($stmt, "s", $correo);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        $mensaje = "Ese correo ya está registrado.";
    } else {
        // 2) Guardar al usuario (la contraseña se guarda encriptada)
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt2 = mysqli_prepare($conexion, "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)");
        mysqli_stmt_bind_param($stmt2, "sss", $nombre, $correo, $hash);

        if (mysqli_stmt_execute($stmt2)) {
            // 3) Registro exitoso: dejo la sesión iniciada y lo mando a la tienda
            $_SESSION["id"]     = mysqli_insert_id($conexion);
            $_SESSION["nombre"] = $nombre;
            $_SESSION["correo"] = $correo;

            header("Location: index.php");
            exit;
        } else {
            $mensaje = "Ocurrió un error al registrar. Intenta de nuevo.";
        }
    }
}

// Si llega aquí es porque algo estuvo mal y se muestra el error
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Levis - Registro</title>
    <link rel="stylesheet" href="../styles/register.css">
</head>
<body>
    <div class="caja">
        <h1>LEVIS</h1>
        <p class="error"><?php echo $mensaje; ?></p>
        <p><a href="../views/register.html">Volver al registro</a></p>
        <p><a href="../views/login.html">¿Ya tienes cuenta? Inicia sesión</a></p>
    </div>
</body>
</html>