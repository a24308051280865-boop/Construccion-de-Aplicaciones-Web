const form = document.getElementById('pedido');
let currentUser = null;

// Proteger la página: sin cuenta/sesión se redirige al login
(async () => {
  const session = await api('session.php');
  if (!session.logged) { location.href = 'login.html?requiere=1'; return; }
  currentUser = session.user;

  // Cargar las marcas desde la base de datos
  const result = await api('marcas.php');
  const select = document.getElementById('marca');
  select.innerHTML = '<option value="">Selecciona...</option>';
  (result.marcas || []).forEach(brand => select.add(new Option(brand.nombre, brand.id_marca)));
})();

// Enviar el pedido con validaciones y confirmación
form.addEventListener('submit', async event => {
  event.preventDefault();

  const ok = validate(form, {
    id_marca: v => v !== '' || 'Selecciona una marca.',
    prenda: v => v !== '' || 'Selecciona una prenda.',
    talla: v => v !== '' || 'Selecciona una talla.',
    cantidad: v => (Number.isInteger(Number(v)) && v >= 1 && v <= 99) || 'La cantidad debe ser de 1 a 99.',
    direccion: v => v.length >= 8 || 'Escribe una dirección completa (mínimo 8 caracteres).'
  });
  if (!ok) return;

  // Popup de confirmación con el resumen del pedido
  const confirmed = await showConfirm('Confirma tu pedido', [
    ['Marca', form.elements.id_marca.selectedOptions[0].text],
    ['Prenda', form.elements.prenda.value],
    ['Talla', form.elements.talla.value],
    ['Cantidad', form.elements.cantidad.value],
    ['Envío', form.elements.direccion.value.trim()]
  ], 'Confirmar', 'Cancelar');
  if (!confirmed) return;

  const button = form.querySelector('button');
  button.disabled = true;

  const result = await api('pedido.php', 'POST', formData(form));
  button.disabled = false;

  // Sesión vencida: volver al login
  if (result.error === 'Debes iniciar sesión.') { location.href = 'login.html?requiere=1'; return; }

  if (result.success) {
    form.reset();
    showBanner('Pedido confirmado', currentUser.nombre + ', tu pedido #' + result.id + ' fue guardado.', 'Aceptar');
  } else showMsg(result.error || 'Error', false);
});