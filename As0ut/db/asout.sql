DROP DATABASE IF EXISTS as0ut;
CREATE DATABASE as0ut CHARACTER SET utf8mb4;
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

-- Pedido: datos de entrega y pago (coincide con api/pedido.php y api/mis_pedidos.php)
CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nombre_receptor VARCHAR(100) NOT NULL,
  telefono VARCHAR(10) NOT NULL,
  calle VARCHAR(150) NOT NULL,
  colonia VARCHAR(100) NOT NULL,
  ciudad VARCHAR(80) NOT NULL,
  estado VARCHAR(80) NOT NULL,
  codigo_postal CHAR(5) NOT NULL,
  referencias VARCHAR(200) NOT NULL DEFAULT '',
  metodo_pago VARCHAR(40) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estatus VARCHAR(30) NOT NULL DEFAULT 'Recibido',
  creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Una fila por prenda; guarda nombre, marca y precio de ese momento
CREATE TABLE pedido_items (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  producto_nombre VARCHAR(80) NOT NULL,
  marca VARCHAR(60) NOT NULL,
  talla VARCHAR(4) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

INSERT INTO marcas (nombre) VALUES
('Zara'),('H&M'),('Levi''s'),('Adidas'),('Nike'),('Puma'),
('Tommy Hilfiger'),('Calvin Klein'),('Lacoste'),('Pull&Bear');
