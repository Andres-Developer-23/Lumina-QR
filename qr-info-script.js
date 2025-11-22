// Script para manejar la página de información QR
document.addEventListener('DOMContentLoaded', function() {
    const qrInfoContainer = document.getElementById('qrInfoContainer');
    const loadingIndicator = document.getElementById('loading');

    // Obtener ID del producto desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));

    if (!productoId) {
        showError('Producto no encontrado');
        return;
    }

    loadQRInfo(productoId);

    async function loadQRInfo(id) {
        try {
            // Cargar producto
            const producto = await productosAPI.getProductoById(id);

            // Renderizar contenido
            renderQRInfo(producto);

            // Actualizar título de la página
            document.title = `Información QR - ${producto.nombre} - Lumina QR`;

        } catch (error) {
            console.error('Error al cargar información:', error);
            showError('Producto no encontrado');
        }
    }

    function renderQRInfo(producto) {
        qrInfoContainer.innerHTML = `
            <div class="row align-items-center mb-5">
                <div class="col-lg-6 text-center mb-4">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded shadow" style="max-height: 400px;">
                </div>
                <div class="col-lg-6">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
                            <li class="breadcrumb-item"><a href="productos.html">Productos</a></li>
                            <li class="breadcrumb-item active">Información QR</li>
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
                            <h5 class="mb-0"><i class="fas fa-qrcode me-2"></i>Información del Código QR</h5>
                        </div>
                        <div class="card-body text-center">
                            <img src="${producto.qr_url}" alt="Código QR de ${producto.nombre}" class="img-fluid mb-3" style="max-width: 200px;">
                            <p class="mb-3">Tu código QR incluye acceso exclusivo a:</p>
                            <ul class="list-unstyled">
                                ${producto.detalles.qr_incluye.map(info => `
                                    <li class="mb-2">
                                        <i class="fas fa-check-circle text-success me-2"></i>
                                        ${info}
                                    </li>
                                `).join('')}
                            </ul>
                            <button class="btn btn-outline-info btn-sm mt-3" onclick="downloadQR('${producto.qr_url}', '${producto.nombre}')">
                                <i class="fas fa-download me-2"></i>Descargar QR
                            </button>
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
        qrInfoContainer.style.display = 'block';
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

    // Función global para descargar QR
    window.downloadQR = function(qrUrl, nombreProducto) {
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = `QR-${nombreProducto.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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