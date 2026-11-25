<?php
session_start();

if (isset($_GET["salir"])) {
    session_destroy();
    header("Location: index.php");
    exit;
}

$logueado = isset($_SESSION["nombre"]);
$nombre   = $logueado ? htmlspecialchars($_SESSION["nombre"]) : "";
$correo   = $logueado ? htmlspecialchars($_SESSION["correo"]) : "";

$boton = $logueado
    ? '<button type="button" class="btn-comprar">Agregar al carrito</button>'
    : '<a href="views/login.html" class="btn-comprar">Inicia sesión para comprar</a>';
?>
