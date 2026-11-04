const section = document.querySelector('[data-categoria]');
const grid = document.getElementById('grid');
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

// Build one product card (textContent avoids injecting HTML)
function buildCard(product) {
  const card = document.createElement('article');
  card.className = 'product';

  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  thumb.textContent = product.marca;

  const info = document.createElement('div');
  info.className = 'info';
  const brand = document.createElement('p');
  brand.className = 'eyebrow';
  brand.textContent = product.marca;
  const name = document.createElement('h3');
  name.textContent = product.nombre;
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = product.descripcion;
  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = money.format(product.precio);

  info.append(brand, name, desc, price);
  card.append(thumb, info);
  return card;
}

// Load the category products from the API
(async () => {
  const result = await api('productos.php?categoria=' + encodeURIComponent(section.dataset.categoria));
  if (!result.success) {
    grid.textContent = result.error || 'No se pudo cargar el catálogo.';
    return;
  }
  document.getElementById('cat-desc').textContent = result.categoria.descripcion;
  document.getElementById('count').textContent = result.productos.length + ' productos';
  result.productos.forEach(product => grid.appendChild(buildCard(product)));
})();
