// Dependencies
const { api, money, esc, cart } = Site; // Shared helpers from common.js

/// <summary>Checkout page: asks for the delivery data and confirms the order with a popup</summary>
Site.ready.then((user) => {
    if (!user) return Site.goAccount("Inicia sesión para finalizar tu compra.");
    if (cart.get().length === 0) {
        location.href = "carrito.html";
        return;
    }

    const form = document.getElementById("pedido");
    const button = document.getElementById("submit");
    const message = document.getElementById("msg");

    // Order summary on the right
    document.getElementById("items").innerHTML = cart.get().map((line) => `
        <div class="row"><span>${line.cantidad} × ${esc(line.nombre)} (${esc(line.talla)})</span><span>${money(line.precio * line.cantidad)}</span></div>`).join("");
    document.getElementById("total").textContent = money(cart.total());

    // Default values
    form.elements.nombre_receptor.value = user.nombre + " " + user.apellido;
    form.elements.ciudad.value = "Ciudad Juárez";
    form.elements.estado.value = "Chihuahua";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        Site.clearErrors(form);
        message.textContent = "";

        const shipping = {};
        ["nombre_receptor", "telefono", "calle", "colonia", "codigo_postal", "ciudad", "estado", "referencias"].forEach((name) => {
            shipping[name] = form.elements[name].value.trim();
        });
        const payment = form.elements.metodo_pago.value;

        // Validations (the same rules as pedido.php)
        const errors = {};
        if (shipping.nombre_receptor.length < 2) errors.nombre_receptor = "Escribe el nombre de quien recibe.";
        if (shipping.telefono.replace(/\D/g, "").length !== 10) errors.telefono = "El teléfono debe tener 10 dígitos.";
        if (shipping.calle.length < 3) errors.calle = "Escribe la calle y el número.";
        if (shipping.colonia.length < 2) errors.colonia = "Escribe la colonia.";
        if (!/^\d{5}$/.test(shipping.codigo_postal)) errors.codigo_postal = "El código postal debe tener 5 dígitos.";
        if (shipping.ciudad.length < 2) errors.ciudad = "Escribe la ciudad.";
        if (shipping.estado.length < 2) errors.estado = "Escribe el estado.";
        if (shipping.referencias.length > 200) errors.referencias = "Máximo 200 caracteres.";
        if (Object.keys(errors).length > 0) return Site.showErrors(form, errors);

        // Confirmation popup
        const accepted = await Site.confirmBox(
            "¿Confirmar pedido?",
            `<p>Se enviará a <b>${esc(shipping.nombre_receptor)}</b>:</p>
             <p class="muted">${esc(shipping.calle)}, ${esc(shipping.colonia)}, ${esc(shipping.ciudad)}, ${esc(shipping.estado)} C.P. ${esc(shipping.codigo_postal)}</p>
             <p>${cart.count()} prendas · Pago: ${esc(payment)}</p>
             <p><b>Total: ${money(cart.total())}</b></p>`,
            "Sí, confirmar",
            "Revisar"
        );
        if (!accepted) return;

        button.disabled = true;
        button.textContent = "Guardando...";
        const items = cart.get().map((line) => ({ id: line.id, talla: line.talla, cantidad: line.cantidad }));
        const result = await api("pedido.php", { items: items, envio: shipping, metodo_pago: payment });

        if (!result.success) {
            message.textContent = result.error || "No se pudo guardar el pedido.";
            button.disabled = false;
            button.textContent = "Confirmar pedido";
            return;
        }

        cart.save([]);
        Site.flash("Pedido #" + result.id + " recibido. ¡Gracias por tu compra, " + user.nombre + "!");
        location.href = "mis-pedidos.html?nuevo=" + result.id;
    });
});