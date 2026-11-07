// Dependencies
const { api, esc, productCard, bindAdd } = Site; // Shared helpers from common.js

/// <summary>Catalog page: loads one category (the slug is the file name) and filters it in the browser</summary>
Site.ready.then(async () => {
    const grid = document.getElementById("grid");
    const result = await api("productos.php?categoria=" + encodeURIComponent(Site.pageSlug()));

    if (!result.success) {
        grid.innerHTML = `<p class="empty">${esc(result.error || "No se pudo cargar el catálogo.")}</p>`;
        return;
    }

    // Page texts
    document.title = result.categoria.nombre + " · As0ut";
    document.getElementById("cat-title").textContent = result.categoria.nombre;
    document.getElementById("cat-desc").textContent = result.categoria.descripcion;

    const products = result.productos;
    const brands = [...new Set(products.map((product) => product.marca))].sort();
    const chips = document.getElementById("chips");
    const search = document.getElementById("search");
    const sort = document.getElementById("sort");
    let activeBrand = "";

    /// <summary>Draws the brand chips</summary>
    function drawChips() {
        chips.innerHTML = [""].concat(brands).map((brand) =>
            `<button type="button" class="chip${brand === activeBrand ? " active" : ""}" data-brand="${esc(brand)}">${brand === "" ? "Todas" : esc(brand)}</button>`
        ).join("");
    }

    /// <summary>Applies brand, search and sort, then draws the cards</summary>
    function draw() {
        const term = search.value.trim().toLowerCase();
        let list = products.filter((product) => activeBrand === "" || product.marca === activeBrand);
        if (term !== "") list = list.filter((product) => (product.nombre + " " + product.marca + " " + product.descripcion).toLowerCase().includes(term));
        if (sort.value === "asc") list.sort((a, b) => a.precio - b.precio);
        if (sort.value === "desc") list.sort((a, b) => b.precio - a.precio);

        document.getElementById("count").textContent = list.length + (list.length === 1 ? " producto" : " productos");
        grid.innerHTML = list.length > 0
            ? list.map((product) => productCard(product)).join("")
            : `<p class="empty">No hay productos con esos filtros.</p>`;
    }

    chips.addEventListener("click", (event) => {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        activeBrand = chip.dataset.brand;
        drawChips();
        draw();
    });
    search.addEventListener("input", draw);
    sort.addEventListener("change", draw);

    bindAdd(grid, products);
    drawChips();
    draw();
});