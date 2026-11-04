const form = document.getElementById('register');

// Enviar el formulario de registro con validaciones
form.addEventListener('submit', async event => {
  event.preventDefault();

  // Validar cada campo antes de enviar al servidor
  const ok = validate(form, {
    firstName: RULES.name,
    lastName: RULES.name,
    email: RULES.email,
    password: RULES.password,
    confirm: v => v === form.elements.password.value.trim() || 'Las contraseñas no coinciden.'
  });
  if (!ok) return;

  // Evitar envíos dobles mientras responde el servidor
  const button = form.querySelector('button');
  button.disabled = true;

  const result = await api('register.php', 'POST', formData(form));
  button.disabled = false;

  // Error del servidor (correo duplicado, validación, etc.)
  if (!result.success) { showMsg(result.error || 'Error', false); return; }

  // Cuenta creada y sesión ya iniciada: banner de bienvenida y paso directo al pedido
  showBanner(
    'Bienvenido, ' + result.user.nombre,
    'Tu cuenta fue creada y ya iniciaste sesión.',
    'Continuar',
    () => { location.href = 'pedido.html'; }
  );
});