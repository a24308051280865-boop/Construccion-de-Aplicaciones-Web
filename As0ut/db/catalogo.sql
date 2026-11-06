-- Catalog tables and 60 products (10 per category). Safe to re-run.
SET NAMES utf8mb4;
USE as0ut;

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  slug VARCHAR(40) NOT NULL UNIQUE,
  descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  id_marca INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_categoria_nombre (id_categoria, nombre),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

INSERT IGNORE INTO categorias (nombre, slug, descripcion) VALUES
('Playeras','playeras','Playeras básicas, oversize y deportivas de las mejores marcas.'),
('Camisas','camisas','Camisas de vestir, casuales y de mezclilla.'),
('Pantalones','pantalones','Jeans, chinos, joggers y pantalones de vestir.'),
('Sudaderas','sudaderas','Hoodies y sudaderas para todos los días.'),
('Chamarras','chamarras','Bombers, cortavientos y chamarras de mezclilla.'),
('Vestidos','vestidos','Vestidos casuales, deportivos y de noche.');

-- Playeras
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Playera básica de algodón','Cuello redondo, corte regular.',399.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Playera oversize','Caída holgada en algodón suave.',249.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Playera Batwing Logo','Logo clásico en el pecho.',549.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Playera Trefoil','Algodón con trébol bordado.',599.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Playera Sportswear','Jersey cómodo para diario.',649.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Playera Essentials','Ligera con logo en el pecho.',449.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Playera Flag','Bandera bordada en el pecho.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Playera Monograma','Algodón orgánico con logo.',799.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Playera Piqué','El clásico con cocodrilo bordado.',1499.00),
((SELECT id_categoria FROM categorias WHERE slug='playeras'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Playera estampada','Gráfico urbano en la espalda.',299.00);

-- Camisas
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Camisa de lino','Fresca, manga larga.',799.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Camisa Oxford','Algodón con cuello botonado.',499.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Camisa vaquera','Mezclilla con bolsillos frontales.',1099.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Camisa Originals','Sarga ligera con logo discreto.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Camisa Club','Estilo casual de manga corta.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Camisa Woven','Tejido ligero y resistente.',699.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Camisa Oxford Slim','Corte entallado, algodón.',1399.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Camisa de popelina','Elegante y de cuidado fácil.',1299.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Camisa manga larga','Algodón premium con logo.',1899.00),
((SELECT id_categoria FROM categorias WHERE slug='camisas'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Camisa de cuadros','Estilo relajado de franela.',499.00);

-- Pantalones
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Pantalón de sastre','Corte recto para oficina.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Pantalón chino','Algodón elástico, tiro medio.',599.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Jeans 501 Original','El jean recto de siempre.',1499.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Pants Tiro','Entrenamiento con pernera ajustada.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Jogger Club','Felpa suave con puños.',999.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Pants Essentials','Cintura elástica con cordón.',699.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Chino Bleecker','Slim fit, gabardina elástica.',1599.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Jeans Slim','Mezclilla oscura ajustada.',1399.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Pantalón deportivo','Tejido técnico con logo.',1699.00),
((SELECT id_categoria FROM categorias WHERE slug='pantalones'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Jeans baggy','Corte holgado de moda.',699.00);

-- Sudaderas
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Sudadera básica','Cuello redondo de algodón.',699.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Hoodie clásico','Capucha y bolsillo canguro.',499.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Sudadera Crewneck','Logo bordado, felpa interior.',1099.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Hoodie Adicolor','Trébol clásico, varios colores.',1199.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Hoodie Club Fleece','Felpa cálida y suave.',1299.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Hoodie Essentials','Algodón con logo grande.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Sudadera Logo','Logo bordado en el pecho.',1499.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Sudadera Institucional','Letras en relieve.',1399.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Sudadera con cierre','Algodón con cuello alto.',2199.00),
((SELECT id_categoria FROM categorias WHERE slug='sudaderas'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Sudadera estampada','Gráfico oversize.',599.00);

-- Chamarras
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Chamarra Bomber','Acabado satinado, cierre frontal.',1299.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Chamarra acolchada','Relleno ligero para el frío.',999.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Trucker Denim','La chamarra de mezclilla icónica.',1799.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Chamarra Track','Estilo retro con franjas.',1199.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Windrunner','Cortaviento con capucha.',1599.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Chamarra cortaviento','Ligera y repelente al agua.',1099.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Chamarra Harrington','Clásica con forro a cuadros.',2999.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Chamarra ligera','Corte moderno, sin forro.',2499.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Chamarra deportiva','Tejido técnico con logo.',2799.00),
((SELECT id_categoria FROM categorias WHERE slug='chamarras'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Chamarra Sherpa','Forro de borrego, mezclilla.',899.00);

-- Vestidos
INSERT IGNORE INTO productos (id_categoria, id_marca, nombre, descripcion, precio) VALUES
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Zara' LIMIT 1),'Vestido midi','Corte fluido con cinturón.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='H&M' LIMIT 1),'Vestido camisero','Botones al frente, algodón.',599.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Levi''s' LIMIT 1),'Vestido de mezclilla','Estilo utilitario.',1299.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Adidas' LIMIT 1),'Vestido de tenis','Deportivo con falda plisada.',799.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Nike' LIMIT 1),'Vestido deportivo','Tejido que transpira.',899.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Puma' LIMIT 1),'Vestido polo','Cuello polo, ajuste cómodo.',699.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Tommy Hilfiger' LIMIT 1),'Vestido de punto','Rayas marinas, manga corta.',1799.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Calvin Klein' LIMIT 1),'Vestido Slip','Satín con tirantes finos.',1999.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Lacoste' LIMIT 1),'Vestido polo piqué','Piqué con cocodrilo bordado.',2599.00),
((SELECT id_categoria FROM categorias WHERE slug='vestidos'),(SELECT id_marca FROM marcas WHERE nombre='Pull&Bear' LIMIT 1),'Vestido corto floral','Estampado ligero de verano.',499.00);
