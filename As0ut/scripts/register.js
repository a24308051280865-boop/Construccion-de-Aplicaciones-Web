/// <summary>Register page: validates the form, calls register.php and enters directly with the new account</summary>
Site.ready.then((user) => {
    if (user) {
        location.href = Site.ROOT + "index.html";
        return;
    }

    const form = document.getElementById("register");
    const button = document.getElementById("submit");
    const message = document.getElementById("msg");
    const namePattern = /^[\p{L}' ]{2,60}$/u;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        Site.clearErrors(form);
        message.textContent = "";

        const firstName = form.elements.firstName.value.trim();
        const lastName = form.elements.lastName.value.trim();
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;
        const confirm = form.elements.confirm.value;

        // Validations (the same rules as register.php)
        const errors = {};
        if (!namePattern.test(firstName)) errors.firstName = "Solo letras, de 2 a 60 caracteres.";
        if (!namePattern.test(lastName)) errors.lastName = "Solo letras, de 2 a 60 caracteres.";
        if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Escribe un email válido.";
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) errors.password = "Mínimo 8 caracteres, con letras y números.";
        if (confirm !== password) errors.confirm = "Las contraseñas no coinciden.";
        if (Object.keys(errors).length > 0) return Site.showErrors(form, errors);

        button.disabled = true;
        button.textContent = "Creando cuenta...";
        const result = await Site.api("register.php", { firstName: firstName, lastName: lastName, email: email, password: password });

        if (!result.success) {
            message.textContent = result.error || "No se pudo crear la cuenta.";
            button.disabled = false;
            button.textContent = "Crear cuenta";
            return;
        }

        Site.markAccount();
        Site.flash("Cuenta creada. Bienvenido, " + result.user.nombre + ".");
        location.href = Site.next();
    });
});