CREATE DATABASE IF NOT EXISTS as0ut CHARACTER SET utf8mb4;
USE as0ut;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE marcas (
  id_marca INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL
);

CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_marca INT NOT NULL,
  prenda VARCHAR(40) NOT NULL,
  talla VARCHAR(4) NOT NULL,
  cantidad INT NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

INSERT INTO marcas (nombre) VALUES
('Zara'),('H&M'),('Levi''s'),('Adidas'),('Nike'),('Puma'),
('Tommy Hilfiger'),('Calvin Klein'),('Lacoste'),('Pull&Bear');