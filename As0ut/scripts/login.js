/// <summary>Login page: validates the form, calls login.php and goes back to where the visitor was</summary>
Site.ready.then((user) => {
    if (user) {
        location.href = Site.ROOT + "index.html";
        return;
    }

    const form = document.getElementById("login");
    const button = document.getElementById("submit");
    const message = document.getElementById("msg");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        Site.clearErrors(form);
        message.textContent = "";

        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;

        // Validations
        const errors = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Escribe un email válido.";
        if (password === "") errors.password = "Escribe tu contraseña.";
        if (Object.keys(errors).length > 0) return Site.showErrors(form, errors);

        button.disabled = true;
        button.textContent = "Entrando...";
        const result = await Site.api("login.php", { email: email, password: password });

        if (!result.success) {
            message.textContent = result.error || "No se pudo iniciar sesión.";
            button.disabled = false;
            button.textContent = "Entrar";
            return;
        }

        Site.markAccount();
        Site.flash("Bienvenido de nuevo, " + result.user.nombre + ".");
        location.href = Site.next();
    });
});