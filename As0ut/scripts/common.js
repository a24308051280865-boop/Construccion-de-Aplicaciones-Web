// Rutas base según la carpeta donde esté la página (raíz o views/)
const IN_VIEWS = location.pathname.includes('/views/');
const API = IN_VIEWS ? '../api/' : 'api/';
const VIEWS = IN_VIEWS ? '' : 'views/';

// Reglas de validación reutilizables: devuelven true o el mensaje de error
const RULES = {
  name: v => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,60}$/.test(v) || 'Solo letras, entre 2 y 60 caracteres.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Escribe un email válido.',
  password: v => (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) || 'Mínimo 8 caracteres, con letras y números.',
  required: v => v !== '' || 'Este campo es obligatorio.'
};

// Llama a un endpoint de la API y devuelve la respuesta JSON
async function api(url, method = 'GET', body) {
  try {
    const response = await fetch(API + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });

    // Si la respuesta no es JSON, se muestra el texto real del error de PHP (sin etiquetas HTML)
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      return { success: false, logged: false, error: 'Error de PHP: ' + clean };
    }

  } catch {
    // Sin conexión con el servidor
    return { success: false, logged: false, error: 'No se pudo conectar con el servidor.' };
  }
}

// Muestra un mensaje de éxito o de error en el elemento #msg
function showMsg(text, ok) {
  const msg = document.getElementById('msg');
  msg.textContent = (ok ? '✓ ' : '✕ ') + text;
  msg.className = 'msg ' + (ok ? 'ok' : 'err');
}

// Convierte los campos de un formulario en un objeto
function formData(form) {
  return Object.fromEntries(new FormData(form));
}

// Muestra u oculta el mensaje de error debajo de un campo
function setError(input, message) {
  const label = input.closest('label');
  let span = label.querySelector('.error');
  if (!span) {
    span = document.createElement('small');
    span.className = 'error';
    label.appendChild(span);
  }
  span.textContent = message;
  input.classList.toggle('invalid', message !== '');
}

// Valida los campos de un formulario; devuelve true si todos son correctos
function validate(form, checks) {
  let ok = true;
  for (const [field, check] of Object.entries(checks)) {
    const input = form.elements[field];
    const result = check(input.value.trim());
    setError(input, result === true ? '' : result);
    if (result !== true) ok = false;
  }
  return ok;
}

// Quita el error de un campo en cuanto el usuario vuelve a escribir
document.addEventListener('input', event => {
  if (event.target.matches('input, select') && event.target.closest('label')) setError(event.target, '');
});

// Banner emergente centrado con barra de tiempo; se cierra solo o con el botón
function showBanner(title, text, buttonText, onClose, seconds = 4) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = '<div class="banner" role="dialog" aria-modal="true"><p class="eyebrow">AS0UT</p><h3></h3><p class="text"></p><div class="bar"></div><button class="btn"></button></div>';

  // textContent evita inyectar HTML con el nombre del usuario
  overlay.querySelector('h3').textContent = title;
  overlay.querySelector('.text').textContent = text;
  overlay.querySelector('.bar').style.animationDuration = seconds + 's';
  const button = overlay.querySelector('button');
  button.textContent = buttonText;

  // Cerrar una sola vez, ya sea por clic o por tiempo
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    overlay.remove();
    if (onClose) onClose();
  };
  button.onclick = close;
  setTimeout(close, seconds * 1000);

  document.body.appendChild(overlay);
  button.focus();
}

// Popup de confirmación con resumen; devuelve una promesa: true si confirma, false si cancela
function showConfirm(title, rows, confirmText, cancelText) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<div class="banner" role="dialog" aria-modal="true"><p class="eyebrow">AS0UT</p><h3></h3><ul class="summary"></ul><div class="actions"><button type="button" class="btn ghost"></button><button type="button" class="btn"></button></div></div>';

    // textContent evita inyectar HTML con lo que escribió el usuario
    overlay.querySelector('h3').textContent = title;
    const list = overlay.querySelector('.summary');
    rows.forEach(([label, value]) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      const data = document.createElement('b');
      name.textContent = label;
      data.textContent = value;
      item.append(name, data);
      list.appendChild(item);
    });

    const [cancelButton, confirmButton] = overlay.querySelectorAll('button');
    cancelButton.textContent = cancelText;
    confirmButton.textContent = confirmText;

    // Cerrar y devolver la decisión; Esc cuenta como cancelar
    const finish = answer => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(answer);
    };
    const onKey = event => { if (event.key === 'Escape') finish(false); };
    document.addEventListener('keydown', onKey);
    cancelButton.onclick = () => finish(false);
    confirmButton.onclick = () => finish(true);

    document.body.appendChild(overlay);
    confirmButton.focus();
  });
}

// Dibuja el menú según haya sesión iniciada o no
async function loadNav() {
  const nav = document.getElementById('nav');
  const session = await api('session.php');
  if (session.logged) {
    nav.innerHTML = `<a href="${VIEWS}pedido.html">Pedido</a><button id="logout">Salir (${session.user.nombre})</button>`;
    document.getElementById('logout').onclick = async () => {
      await api('logout.php', 'POST');
      location.href = IN_VIEWS ? '../index.html' : 'index.html';
    };
  } else {
    nav.innerHTML = `<a href="${VIEWS}login.html">Entrar</a><a href="${VIEWS}register.html">Crear cuenta</a>`;

    // Sin cuenta, el botón de la portada lleva al registro
    const cta = document.getElementById('cta');
    if (cta) {
      cta.textContent = 'Crear cuenta para pedir';
      cta.href = VIEWS + 'register.html';
    }
  }
  return session;
}

loadNav();