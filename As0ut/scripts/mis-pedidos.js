// Dependencies
const { api, money, esc } = Site; // Shared helpers from common.js

/// <summary>Orders page: lists the orders of the logged-in user</summary>
Site.ready.then(async (user) => {
    if (!user) return Site.goAccount("Inicia sesión para ver tus pedidos.");

    const host = document.getElementById("orders");
    const newId = Number(new URLSearchParams(location.search).get("nuevo")) || 0;
    const result = await api("mis_pedidos.php");

    if (!result.success) {
        host.innerHTML = `<p class="empty">${esc(result.error || "No se pudieron cargar tus pedidos.")}</p>`;
        return;
    }

    if (result.pedidos.length === 0) {
        host.innerHTML = `
            <div class="empty">
                <h3>Aún no tienes pedidos</h3>
                <p class="muted">Cuando confirmes una compra aparecerá aquí.</p>
                <a class="btn" href="${Site.ROOT}index.html#categorias">Ir al catálogo</a>
            </div>`;
        return;
    }

    host.innerHTML = (newId ? `<p class="banner-ok">¡Gracias por tu compra! Tu pedido #${newId} fue recibido.</p>` : "") +
        result.pedidos.map((order) => {
            const date = new Date(order.creado.replace(" ", "T")).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
            const rows = order.items.map((item) => `
                <tr>
                    <td>${esc(item.producto_nombre)}<br><span class="muted">${esc(item.marca)}</span></td>
                    <td>${esc(item.talla)}</td>
                    <td>${item.cantidad}</td>
                    <td>${money(item.precio_unitario)}</td>
                </tr>`).join("");
            return `
                <article class="order${order.id_pedido === newId ? " new" : ""}">
                    <div class="order-head">
                        <div><strong>Pedido #${order.id_pedido}</strong> <span class="muted">· ${esc(date)}</span></div>
                        <span class="badge">${esc(order.estatus)}</span>
                    </div>
                    <table>
                        <tr><th>Producto</th><th>Talla</th><th>Cant.</th><th>Precio</th></tr>
                        ${rows}
                    </table>
                    <div class="order-foot">
                        <div class="muted">
                            Entrega para <b>${esc(order.nombre_receptor)}</b> · Tel. ${esc(order.telefono)}<br>
                            ${esc(order.calle)}, ${esc(order.colonia)}, ${esc(order.ciudad)}, ${esc(order.estado)} C.P. ${esc(order.codigo_postal)}<br>
                            Pago: ${esc(order.metodo_pago)}
                        </div>
                        <strong class="big">${money(order.total)}</strong>
                    </div>
                </article>`;
        }).join("");
});