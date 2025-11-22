// Script para manejar la página de productos usando la API falsa
document.addEventListener('DOMContentLoaded', function() {
    let allProductos = [];
    let filteredProductos = [];
    const productosContainer = document.getElementById('productosContainer');
    const loadingIndicator = document.getElementById('loading');
    const searchInput = document.getElementById('searchInput');
    const lineaFilter = document.getElementById('lineaFilter');

    // Inicializar la página
    initProductosPage();

    async function initProductosPage() {
        try {
            // Cargar productos
            allProductos = await productosAPI.getAllProductos();
            filteredProductos = [...allProductos];

            // Cargar líneas disponibles para el filtro
            await loadLineasFilter();

            // Renderizar productos
            renderProductos(filteredProductos);

            // Configurar event listeners
            setupEventListeners();

        } catch (error) {
            console.error('Error al cargar productos:', error);
            showError('Error al cargar los productos. Por favor, recarga la página.');
        }
    }

    async function loadLineasFilter() {
        try {
            const lineas = await productosAPI.getLineasDisponibles();
            lineaFilter.innerHTML = '<option value="">Todas las líneas</option>';
            lineas.forEach(linea => {
                const option = document.createElement('option');
                option.value = linea;
                option.textContent = linea;
                lineaFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar líneas:', error);
        }
    }

    function setupEventListeners() {
        // Búsqueda
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // Filtro por línea
        lineaFilter.addEventListener('change', handleFilter);

        // Event delegation para botones de productos
        productosContainer.addEventListener('click', handleProductoClick);
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        filterProductos(query, lineaFilter.value);
    }

    function handleFilter() {
        const linea = lineaFilter.value;
        filterProductos(searchInput.value.trim(), linea);
    }

    function filterProductos(query, linea) {
        filteredProductos = allProductos.filter(producto => {
            const matchesQuery = !query ||
                producto.nombre.toLowerCase().includes(query.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                producto.linea.toLowerCase().includes(query.toLowerCase());

            const matchesLinea = !linea || producto.linea === linea;

            return matchesQuery && matchesLinea;
        });

        renderProductos(filteredProductos);
    }

    function renderProductos(productos) {
        if (productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No se encontraron productos</h4>
                    <p class="text-muted">Intenta con otros términos de búsqueda</p>
                </div>
            `;
        } else {
            productosContainer.innerHTML = productos.map(producto => createProductoCard(producto)).join('');
        }

        // Ocultar loading y mostrar contenedor
        loadingIndicator.style.display = 'none';
        productosContainer.style.display = 'flex';
    }

    function createProductoCard(producto) {
        return `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 shadow-sm hover-card producto-card" data-producto-id="${producto.id}">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text text-muted">${producto.linea}</p>
                        <p class="card-text">${producto.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="h5 text-primary fw-bold">${formatPrice(producto.precio)}</span>
                            <img src="${producto.qr_url}" alt="QR Code" class="qr-code" style="width: 60px; height: 60px;">
                        </div>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-outline-primary me-2 ver-detalles-btn" data-producto-id="${producto.id}">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="btn btn-primary comprar-btn" data-producto-id="${producto.id}">
                                <i class="fas fa-shopping-cart"></i> Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function handleProductoClick(event) {
        const target = event.target.closest('.ver-detalles-btn, .comprar-btn');
        if (!target) return;

        const productoId = parseInt(target.dataset.productoId);

        if (target.classList.contains('ver-detalles-btn')) {
            // Redirigir a página de detalle
            window.location.href = `producto-detalle.html?id=${productoId}`;
        } else if (target.classList.contains('comprar-btn')) {
            handleCompra(productoId);
        }
    }


    async function handleCompra(productoId) {
        try {
            const result = await productosAPI.addToCart(productoId);
            showSuccess(result.message);

            // Aquí podrías redirigir a una página de carrito o contacto
            setTimeout(() => {
                window.location.href = 'contacto.html';
            }, 1500);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            showError('Error al procesar la compra');
        }
    }

    // Funciones de utilidad
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showError(message) {
        // Crear toast de error
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-danger border-0';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-exclamation-triangle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.appendChild(toast);
        document.body.appendChild(container);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        setTimeout(() => {
            container.remove();
        }, 5000);
    }

    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.appendChild(toast);
        document.body.appendChild(container);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        setTimeout(() => {
            container.remove();
        }, 5000);
    }

});