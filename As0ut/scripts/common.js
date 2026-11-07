// Dependencies
// imagenes.js must be loaded before this file (it defines IMAGES)

/// <summary>Shared helpers, header, footer, session and cart used by every page</summary>
const Site = (() => {
    const ROOT = location.pathname.includes("/views/") ? "../" : ""; // Path from this page to the project root
    const VIEWS = ROOT ? "" : "views/";                               // Path from this page to the views folder
    const SIZES = ["XS", "S", "M", "L", "XL"];
    const CATEGORIES = [
        { slug: "playeras", name: "Playeras" },
        { slug: "camisas", name: "Camisas" },
        { slug: "pantalones", name: "Pantalones" },
        { slug: "sudaderas", name: "Sudaderas" },
        { slug: "chamarras", name: "Chamarras" },
        { slug: "vestidos", name: "Vestidos" }
    ];

    let user = null;
    let toastTimer = null;

    /// <summary>Calls an endpoint of the api folder (POST when a body is given) and always returns JSON</summary>
    async function api(path, body) {
        const options = { credentials: "same-origin" };
        if (body) {
            options.method = "POST";
            options.headers = { "Content-Type": "application/json" };
            options.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(ROOT + "api/" + path, options);
            return await response.json();
        } catch (error) {
            return { success: false, error: "No se pudo conectar con el servidor." };
        }
    }

    /// <summary>Formats a number as Mexican pesos</summary>
    function money(value) {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(value);
    }

    /// <summary>Escapes text before putting it inside HTML</summary>
    function esc(text) {
        return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    }

    /// <summary>Returns an img tag, or a striped placeholder while the URL is still "URL_..."</summary>
    function img(url, alt) {
        if (!url || url.indexOf("URL_") === 0)
            return `<div class="ph"><span>${esc(alt)}</span><small>Pon aquí tu URL de imagen</small></div>`;
        return `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy">`;
    }

    /// <summary>Name of the current page without extension (playeras, camisas, ...)</summary>
    function pageSlug() {
        return location.pathname.split("/").pop().replace(".html", "");
    }

    // ---------- Account ----------

    /// <summary>Known visitor goes to login, new visitor goes to register</summary>
    function accountUrl() {
        return VIEWS + (localStorage.getItem("as0ut_has_account") ? "login.html" : "register.html");
    }

    /// <summary>Remembers that this browser already has an account</summary>
    function markAccount() {
        localStorage.setItem("as0ut_has_account", "1");
    }

    /// <summary>Stores a message that is shown as a toast on the next page</summary>
    function flash(message) {
        sessionStorage.setItem("as0ut_flash", message);
    }

    /// <summary>Sends the visitor to login/register and remembers where to come back</summary>
    function goAccount(message) {
        if (message) flash(message);
        sessionStorage.setItem("as0ut_next", location.href);
        location.href = accountUrl();
    }

    /// <summary>Returns the page to open after login/register</summary>
    function next() {
        const target = sessionStorage.getItem("as0ut_next");
        sessionStorage.removeItem("as0ut_next");
        return target || ROOT + "index.html";
    }

    // ---------- Cart (saved in the browser, one cart per user) ----------

    function cartKey() {
        return user ? "as0ut_cart_" + user.id : null;
    }

    /// <summary>Reads the cart lines of the logged-in user</summary>
    function cartGet() {
        const key = cartKey();
        if (!key) return [];
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            return [];
        }
    }

    /// <summary>Saves the cart lines and refreshes the header badge</summary>
    function cartSave(lines) {
        const key = cartKey();
        if (key) localStorage.setItem(key, JSON.stringify(lines));
        updateBadge();
    }

    /// <summary>Total number of garments in the cart</summary>
    function cartCount() {
        return cartGet().reduce(
            (sum, line) => sum + line.cantidad,
            0
        );
    }

    /// <summary>Total price of the cart</summary>
    function cartTotal() {
        return cartGet().reduce(
            (sum, line) => sum + line.precio * line.cantidad,
            0
        );
    }

    /// <summary>Adds one garment (same product and size are grouped)</summary>
    function cartAdd(product, size) {
        const lines = cartGet();
        const line = lines.find((item) => item.id === product.id_producto && item.talla === size);
        if (line) line.cantidad = Math.min(99, line.cantidad + 1);
        else lines.push({ id: product.id_producto, nombre: product.nombre, marca: product.marca, precio: product.precio, talla: size, cantidad: 1 });
        cartSave(lines);
    }

    /// <summary>Changes the quantity of one line (never below 1, never above 99)</summary>
    function cartChange(id, size, delta) {
        const lines = cartGet();
        const line = lines.find((item) => item.id === id && item.talla === size);
        if (line) line.cantidad = Math.max(1, Math.min(99, line.cantidad + delta));
        cartSave(lines);
    }

    /// <summary>Removes one line from the cart</summary>
    function cartRemove(id, size) {
        cartSave(cartGet().filter((item) => !(item.id === id && item.talla === size)));
    }

    function updateBadge() {
        const node = document.getElementById("cart-count");
        if (!node) return;
        const count = cartCount();
        node.textContent = count;
        node.hidden = count === 0;
    }

    // ---------- Interface helpers ----------

    /// <summary>Shows a small banner at the top right for a few seconds</summary>
    function toast(message) {
        let node = document.getElementById("toast");
        if (!node) {
            node = document.createElement("div");
            node.id = "toast";
            node.className = "toast";
            node.setAttribute("role", "status");
            document.body.appendChild(node);
        }
        node.textContent = message;
        node.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => node.classList.remove("show"), 3500);
    }

    /// <summary>Shows a confirmation popup and resolves true (accept) or false (cancel)</summary>
    function confirmBox(title, html, okText, cancelText) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal";
            overlay.innerHTML = `
                <div class="modal-box" role="dialog" aria-modal="true">
                    <h3>${title}</h3>
                    <div>${html}</div>
                    <div class="modal-actions">
                        <button type="button" class="btn ghost" data-answer="no">${cancelText || "Cancelar"}</button>
                        <button type="button" class="btn" data-answer="yes">${okText || "Aceptar"}</button>
                    </div>
                </div>`;
            overlay.addEventListener("click", (event) => {
                const answer = event.target.getAttribute("data-answer");
                if (!answer && event.target !== overlay) return;
                overlay.remove();
                resolve(answer === "yes");
            });
            document.body.appendChild(overlay);
        });
    }

    /// <summary>Removes the error marks of a form</summary>
    function clearErrors(form) {
        form.querySelectorAll(".err").forEach((node) => node.remove());
        form.querySelectorAll(".invalid").forEach((node) => node.classList.remove("invalid"));
    }

    /// <summary>Marks the invalid fields of a form: errors is { fieldName: message }</summary>
    function showErrors(form, errors) {
        clearErrors(form);
        let first = null;
        Object.keys(errors).forEach((name) => {
            const input = form.elements[name];
            if (!input) return;
            input.classList.add("invalid");
            const note = document.createElement("p");
            note.className = "err";
            note.textContent = errors[name];
            input.insertAdjacentElement("afterend", note);
            if (!first) first = input;
        });
        if (first) first.focus();
    }

    // ---------- Shared product card ----------

    /// <summary>HTML of one product card (guests see a button that sends them to create an account)</summary>
    function productCard(product) {
        const sizes = SIZES.map((size) => `<option${size === "M" ? " selected" : ""}>${size}</option>`).join("");
        const buy = user
            ? `<select class="size" aria-label="Talla">${sizes}</select><button type="button" class="btn sm js-add">Agregar</button>`
            : `<button type="button" class="btn sm js-add">Crea tu cuenta para comprar</button>`;
        return `
            <article class="product" data-id="${product.id_producto}">
                <div class="media">${img(IMAGES.products[product.nombre], product.nombre)}</div>
                <div class="p-body">
                    <p class="brand">${esc(product.marca)}</p>
                    <h3>${esc(product.nombre)}</h3>
                    <p class="desc">${esc(product.descripcion)}</p>
                    <p class="price">${money(product.precio)}</p>
                    <div class="buy">${buy}</div>
                </div>
            </article>`;
    }

    /// <summary>Makes the "Agregar" buttons of a container work (only users with an account can buy)</summary>
    function bindAdd(container, products) {
        container.addEventListener("click", (event) => {
            const button = event.target.closest(".js-add");
            if (!button) return;
            if (!user) return goAccount("Crea tu cuenta o inicia sesión para comprar.");
            const card = button.closest(".product");
            const product = products.find((item) => item.id_producto === Number(card.dataset.id));
            if (!product) return;
            cartAdd(product, card.querySelector(".size").value);
            toast(product.nombre + " se agregó al carrito.");
        });
    }

    // ---------- Header and footer ----------

    /// <summary>Draws the header: menu, cart and the Cuenta button</summary>
    function renderHeader() {
        const host = document.getElementById("site-header");
        if (!host) return;
        const file = location.pathname.split("/").pop() || "index.html";
        const links = CATEGORIES.map((category) => `<a href="${VIEWS}${category.slug}.html">${category.name}</a>`).join("");
        const count = user ? cartCount() : 0;
        const account = user
            ? `<details class="menu right">
                   <summary class="btn sm">Cuenta ▾</summary>
                   <div class="menu-panel">
                       <p class="menu-hello">Hola, <b>${esc(user.nombre)}</b></p>
                       <a href="${VIEWS}mis-pedidos.html">Mis pedidos</a>
                       <button type="button" id="logout">Cerrar sesión</button>
                   </div>
               </details>`
            : `<a class="btn sm" href="${accountUrl()}">Cuenta</a>`;

        host.innerHTML = `
            <div class="bar">
                <a class="logo" href="${ROOT}index.html">AS0UT</a>
                <nav class="nav">
                    <a href="${ROOT}index.html"${file === "index.html" ? ' class="active"' : ""}>Inicio</a>
                    <details class="menu">
                        <summary>Tienda</summary>
                        <div class="menu-panel">${links}</div>
                    </details>
                </nav>
                <div class="tools">
                    <a class="cart-link" href="${VIEWS}carrito.html">Carrito <span class="count" id="cart-count"${count ? "" : " hidden"}>${count}</span></a>
                    ${account}
                </div>
            </div>`;

        const logout = document.getElementById("logout");
        if (logout) logout.addEventListener("click", async () => {
            await api("logout.php", {});
            location.href = ROOT + "index.html";
        });
    }

    /// <summary>Draws the footer</summary>
    function renderFooter() {
        const host = document.getElementById("site-footer");
        if (!host) return;
        const links = CATEGORIES.map((category) => `<a href="${VIEWS}${category.slug}.html">${category.name}</a>`).join("");
        const account = user
            ? `<a href="${VIEWS}carrito.html">Carrito</a><a href="${VIEWS}mis-pedidos.html">Mis pedidos</a>`
            : `<a href="${VIEWS}register.html">Crear cuenta</a><a href="${VIEWS}login.html">Iniciar sesión</a>`;
        host.innerHTML = `
            <div class="foot-in">
                <div>
                    <a class="logo" href="${ROOT}index.html">AS0UT</a>
                    <p>Ropa de las mejores marcas, con envío a domicilio.</p>
                    <p class="muted">Ciudad Juárez, Chihuahua</p>
                </div>
                <div><h4>Categorías</h4>${links}</div>
                <div><h4>Cuenta</h4>${account}</div>
            </div>
            <div class="foot-bar">© 2026 AS0UT</div>`;
    }

    /// <summary>Shows the pending flash message, if any</summary>
    function showFlash() {
        const message = sessionStorage.getItem("as0ut_flash");
        if (!message) return;
        sessionStorage.removeItem("as0ut_flash");
        toast(message);
    }

    // Close the open menus when the click is outside of them
    document.addEventListener("click", (event) => {
        document.querySelectorAll("details.menu[open]").forEach((menu) => {
            if (!menu.contains(event.target)) menu.removeAttribute("open");
        });
    });

    /// <summary>Starts the page: reads the session, draws header and footer, resolves with the user (or null)</summary>
    const ready = (async () => {
        const session = await api("session.php");
        user = session.logged ? session.user : null;
        if (user) markAccount();
        renderHeader();
        renderFooter();
        showFlash();
        return user;
    })();

    return {
        ROOT, VIEWS, SIZES, CATEGORIES, ready,
        api, money, esc, img, pageSlug,
        accountUrl, markAccount, flash, goAccount, next,
        toast, confirmBox, clearErrors, showErrors,
        productCard, bindAdd,
        cart: { get: cartGet, save: cartSave, count: cartCount, total: cartTotal, add: cartAdd, change: cartChange, remove: cartRemove },
        getUser: () => user
    };
})();