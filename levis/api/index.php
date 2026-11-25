<?php
session_start();
if (isset($_GET["salir"])) {
    session_destroy();
    header("Location: ../views/login.html");
    exit;
}
if (!isset($_SESSION["nombre"])) {
    header("Location: ../views/login.html");
    exit;
}

$nombre = htmlspecialchars($_SESSION["nombre"]);
$correo = htmlspecialchars($_SESSION["correo"]);
?>

