// Dependencies
const { api, money, esc, img, cart } = Site; // Shared helpers from common.js

/// <summary>Cart page: refreshes the prices from the server and lets the user change quantities</summary>
Site.ready.then(async (user) => {
    if (!user) return Site.goAccount("Inicia sesión para ver tu carrito.");

    const host = document.getElementById("cart");

    /// <summary>Updates names and prices with the real ones and drops products that no longer exist</summary>
    async function refreshPrices() {
        const lines = cart.get();
        if (lines.length === 0) return;
        const ids = [...new Set(lines.map((line) => line.id))];
        const result = await api("productos.php?ids=" + ids.join(","));
        if (!result.success) return;
        const byId = {};
        result.productos.forEach((product) => { byId[product.id_producto] = product; });
        cart.save(lines.filter((line) => byId[line.id]).map((line) => {
            line.nombre = byId[line.id].nombre;
            line.precio = byId[line.id].precio;
            line.marca = byId[line.id].marca;
            return line;
        }));
    }

    /// <summary>Draws the whole cart</summary>
    function render() {
        const lines = cart.get();

        if (lines.length === 0) {
            host.innerHTML = `
                <div class="empty">
                    <h3>Tu carrito está vacío</h3>
                    <p class="muted">Explora el catálogo y agrega tus prendas favoritas.</p>
                    <a class="btn" href="${Site.ROOT}index.html#categorias">Ver categorías</a>
                </div>`;
            return;
        }

        const rows = lines.map((line) => `
            <div class="line">
                <div class="media">${img(IMAGES.products[line.nombre], line.nombre)}</div>
                <div>
                    <p class="brand">${esc(line.marca)}</p>
                    <h3>${esc(line.nombre)}</h3>
                    <p>Talla ${esc(line.talla)} · ${money(line.precio)} c/u</p>
                    <div class="line-actions" data-id="${line.id}" data-size="${esc(line.talla)}">
                        <div class="qty">
                            <button type="button" data-action="dec" aria-label="Quitar uno">−</button>
                            <span>${line.cantidad}</span>
                            <button type="button" data-action="inc" aria-label="Agregar uno">+</button>
                        </div>
                        <button type="button" class="link-btn" data-action="remove">Quitar</button>
                    </div>
                </div>
                <div class="sub">${money(line.precio * line.cantidad)}</div>
            </div>`).join("");

        host.innerHTML = `
            <div class="split">
                <div>${rows}</div>
                <aside class="summary">
                    <h3>Resumen</h3>
                    <div class="row"><span>Prendas</span><span>${cart.count()}</span></div>
                    <div class="row total"><span>Total</span><span>${money(cart.total())}</span></div>
                    <a class="btn block" href="pedido.html">Finalizar compra</a>
                    <a class="btn ghost block" href="${Site.ROOT}index.html#categorias">Seguir comprando</a>
                    <button type="button" class="link-btn" data-action="clear">Vaciar carrito</button>
                </aside>
            </div>`;
    }

    // One listener for every button of the cart
    host.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const action = button.dataset.action;
        const box = button.closest(".line-actions");
        const id = box ? Number(box.dataset.id) : 0;
        const size = box ? box.dataset.size : "";

        if (action === "inc") cart.change(id, size, 1);
        if (action === "dec") cart.change(id, size, -1);
        if (action === "remove") cart.remove(id, size);
        if (action === "clear") cart.save([]);
        render();
    });

    await refreshPrices();
    render();
});