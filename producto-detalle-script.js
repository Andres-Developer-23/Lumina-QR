// Script para manejar la página de detalle de producto
document.addEventListener('DOMContentLoaded', function() {
    const productoContainer = document.getElementById('productoContainer');
    const loadingIndicator = document.getElementById('loading');
    const productosRelacionados = document.getElementById('productosRelacionados');
    const relacionadosContainer = document.getElementById('relacionadosContainer');

    // Obtener ID del producto desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));

    if (!productoId) {
        showError('Producto no encontrado');
        return;
    }

    loadProductoDetalle(productoId);

    async function loadProductoDetalle(id) {
        try {
            // Cargar producto principal
            const producto = await productosAPI.getProductoById(id);

            // Cargar productos relacionados (misma línea)
            const relacionados = await productosAPI.getProductosByLinea(producto.linea);
            const otrosRelacionados = relacionados.filter(p => p.id !== id).slice(0, 3);

            // Renderizar contenido
            renderProductoDetalle(producto);
            if (otrosRelacionados.length > 0) {
                renderProductosRelacionados(otrosRelacionados);
            }

            // Actualizar título de la página
            document.title = `${producto.nombre} - ${producto.linea} - Lumina QR`;

        } catch (error) {
            console.error('Error al cargar producto:', error);
            showError('Producto no encontrado');
        }
    }

    function renderProductoDetalle(producto) {
        productoContainer.innerHTML = `
            <div class="row align-items-center mb-5">
                <div class="col-lg-6 text-center mb-4">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded shadow" style="max-height: 400px;">
                </div>
                <div class="col-lg-6">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
                            <li class="breadcrumb-item"><a href="productos.html">Productos</a></li>
                            <li class="breadcrumb-item active">${producto.nombre}</li>
                        </ol>
                    </nav>

                    <h1 class="display-5 fw-bold text-primary mb-3">${producto.nombre}</h1>
                    <h3 class="text-muted mb-4">${producto.linea}</h3>

                    <p class="lead mb-4">${producto.descripcion}</p>

                    <div class="row mb-4">
                        <div class="col-sm-6">
                            <h4 class="text-primary">${formatPrice(producto.precio)}</h4>
                            <p class="text-muted mb-0">
                                <i class="fas fa-clock me-2"></i>Duración: ${producto.detalles.duracion}
                            </p>
                        </div>
                        <div class="col-sm-6">
                            <button class="btn btn-primary btn-lg me-3" onclick="handleCompra(${producto.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Comprar Ahora
                            </button>
                            <button class="btn btn-outline-primary btn-lg" onclick="window.history.back()">
                                <i class="fas fa-arrow-left me-2"></i>Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0"><i class="fas fa-info-circle me-2"></i>Descripción Detallada</h4>
                        </div>
                        <div class="card-body">
                            <p class="mb-4">${producto.descripcion}</p>

                            <h5 class="text-primary mb-3"><i class="fas fa-flask me-2"></i>Aromas Principales</h5>
                            <div class="row mb-4">
                                ${producto.detalles.aromas.map(aroma => `
                                    <div class="col-md-4 mb-2">
                                        <div class="alert alert-light border text-center">
                                            <strong>${aroma}</strong>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <h5 class="text-primary mb-3"><i class="fas fa-star me-2"></i>Beneficios</h5>
                            <div class="row">
                                ${producto.detalles.beneficios.map(beneficio => `
                                    <div class="col-md-6 mb-2">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-check text-success me-3"></i>
                                            <span>${beneficio}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0"><i class="fas fa-qrcode me-2"></i>Código QR del Producto</h5>
                        </div>
                        <div class="card-body text-center">
                            <p class="mb-3">Escanea este QR para acceder directamente a este producto:</p>
                            <img src="${producto.qr_url}" alt="QR Code del producto" class="mb-3" style="width: 150px; height: 150px;">
                            <p class="small text-muted">Cada vela incluye un código QR único que revela:</p>
                            <ul class="list-unstyled">
                                ${producto.detalles.qr_incluye.map(info => `
                                    <li class="mb-2">
                                        <i class="fas fa-check-circle text-success me-2"></i>
                                        ${info}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="card shadow-sm">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="fas fa-shipping-fast me-2"></i>Información de Envío</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled">
                                <li class="mb-2"><i class="fas fa-truck text-primary me-2"></i>Envío gratuito en Cienaga</li>
                                <li class="mb-2"><i class="fas fa-clock text-primary me-2"></i>Entrega en 2-3 días hábiles</li>
                                <li class="mb-2"><i class="fas fa-box text-primary me-2"></i>Empaque seguro y ecológico</li>
                                <li class="mb-0"><i class="fas fa-undo text-primary me-2"></i>Devoluciones hasta 7 días</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ocultar loading y mostrar contenido
        loadingIndicator.style.display = 'none';
        productoContainer.style.display = 'block';
    }

    function renderProductosRelacionados(productos) {
        relacionadosContainer.innerHTML = productos.map(producto => `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 shadow-sm hover-card">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h6 class="card-title">${producto.nombre}</h6>
                        <p class="card-text text-muted small">${producto.linea}</p>
                        <p class="card-text small">${producto.descripcion.substring(0, 80)}...</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-primary">${formatPrice(producto.precio)}</span>
                            <a href="producto-detalle.html?id=${producto.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-eye"></i> Ver
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        productosRelacionados.style.display = 'block';
    }

    // Función global para manejar compra (accesible desde HTML)
    window.handleCompra = async function(productoId) {
        try {
            const result = await productosAPI.addToCart(productoId);
            showSuccess(result.message);

            setTimeout(() => {
                window.location.href = 'contacto.html';
            }, 1500);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            showError('Error al procesar la compra');
        }
    };

    function showError(message) {
        loadingIndicator.innerHTML = `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4 class="text-danger">Error</h4>
                <p class="text-muted">${message}</p>
                <a href="productos.html" class="btn btn-primary">Volver a Productos</a>
            </div>
        `;
    }

    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed top-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

});