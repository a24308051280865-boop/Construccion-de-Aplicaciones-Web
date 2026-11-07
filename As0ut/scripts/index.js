// Dependencies
const { api, img, esc, CATEGORIES, VIEWS, productCard, bindAdd } = Site; // Shared helpers from common.js

/// <summary>Home page: fills the images, the category tiles, the featured products and the final button</summary>
Site.ready.then(async (user) => {

    // Hero and "Quiénes somos" images
    document.getElementById("hero-img").innerHTML = img(IMAGES.hero, "Nueva colección");
    document.getElementById("about-img").innerHTML = img(IMAGES.about, "Quiénes somos");

    // Category tiles
    document.getElementById("tiles").innerHTML = CATEGORIES.map((category) => `
        <a class="tile" href="${VIEWS}${category.slug}.html">
            <div class="media">${img(IMAGES.categories[category.slug], category.name)}</div>
            <div class="t-body"><span>${esc(category.name)}</span><span>→</span></div>
        </a>`).join("");

    // Final call to action: depends on the session
    const cta = document.getElementById("cta-account");
    if (user) {
        cta.textContent = "Seguir comprando";
        cta.href = "#categorias";
    } else {
        cta.textContent = localStorage.getItem("as0ut_has_account") ? "Iniciar sesión" : "Crear cuenta";
        cta.href = Site.accountUrl();
    }

    // Featured products
    const grid = document.getElementById("featured");
    const result = await api("productos.php?destacados=1");
    if (!result.success || result.productos.length === 0) {
        grid.innerHTML = `<p class="empty">No se pudieron cargar los productos. Revisa que ejecutaste asout.sql y catalogo.sql.</p>`;
        return;
    }
    grid.innerHTML = result.productos.map((product) => productCard(product)).join("");
    bindAdd(grid, result.productos);
});