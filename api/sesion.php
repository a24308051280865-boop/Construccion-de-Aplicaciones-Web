<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

echo json_encode([
    "logueado" => isset($_SESSION["nombre"]),
    "nombre"   => $_SESSION["nombre"] ?? "",
    "correo"   => $_SESSION["correo"] ?? ""
]);
?>