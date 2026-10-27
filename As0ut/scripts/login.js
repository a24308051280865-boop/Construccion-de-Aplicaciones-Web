const form = document.getElementById('login');

// Avisos según el origen de la visita
const params = new URLSearchParams(location.search);
if (params.get('registrado')) showMsg('Cuenta creada correctamente. Ahora inicia sesión.', true);
if (params.get('requiere')) showMsg('Necesitas una cuenta para hacer un pedido. Inicia sesión o créala.', false);

// Enviar el formulario de inicio de sesión con validaciones
form.addEventListener('submit', async event => {
  event.preventDefault();

  // Validar campos antes de enviar al servidor
  const ok = validate(form, {
    email: RULES.email,
    password: v => v !== '' || 'Escribe tu contraseña.'
  });
  if (!ok) return;

  const button = form.querySelector('button');
  button.disabled = true;

  const result = await api('login.php', 'POST', formData(form));
  button.disabled = false;

  // Error del servidor (credenciales, cuenta inactiva, etc.)
  if (!result.success) { showMsg(result.error || 'Error', false); return; }

  // Éxito: banner de bienvenida con el nombre del usuario y paso al pedido
  showBanner(
    'Bienvenido, ' + result.user.nombre,
    'Iniciaste sesión correctamente. Te llevamos a tu pedido.',
    'Continuar',
    () => { location.href = 'pedido.html'; }
  );
});