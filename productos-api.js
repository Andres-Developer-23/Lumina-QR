// API falsa para manejar productos de Lumina QR
class ProductosAPI {
    constructor() {
        this.productos = [
            {
                id: 1,
                nombre: "Velas Relax",
                linea: "Tranquilidad",
                descripcion: "Aromas de lavanda y vainilla para momentos de paz y relajación. Perfectas para meditación y descanso.",
                precio: 15000,
                icono: "moon",
                color: "primary",
                imagen: "productos/velas-relax.png",
                qr_url: "qr-codes/producto-1.png",
                detalles: {
                    aromas: ["Lavanda", "Vainilla"],
                    duracion: "40-50 horas",
                    beneficios: ["Reduce estrés", "Mejora el sueño", "Promueve relajación"],
                    qr_incluye: ["Historia del aroma", "Técnicas de meditación", "Mensaje de calma"]
                }
            },
            {
                id: 2,
                nombre: "Velas Energía",
                linea: "Vitalidad",
                descripcion: "Esencias cítricas y mentoladas para despertar los sentidos y potenciar la concentración.",
                precio: 15000,
                icono: "sun",
                color: "success",
                imagen: "productos/velas-energia.png",
                qr_url: "qr-codes/producto-2.png",
                detalles: {
                    aromas: ["Limón", "Menta", "Naranja"],
                    duracion: "45-55 horas",
                    beneficios: ["Aumenta energía", "Mejora concentración", "Estimula creatividad"],
                    qr_incluye: ["Propiedades energéticas", "Técnicas de respiración", "Mensaje motivacional"]
                }
            },
            {
                id: 3,
                nombre: "Velas Amor",
                linea: "Romance",
                descripcion: "Aromas florales y dulces para crear ambientes románticos y momentos especiales.",
                precio: 15000,
                icono: "heart",
                color: "warning",
                imagen: "productos/velas-amor.png",
                qr_url: "qr-codes/producto-3.png",
                detalles: {
                    aromas: ["Rosa", "Jazmín", "Vainilla"],
                    duracion: "40-50 horas",
                    beneficios: ["Crea ambiente romántico", "Reduce ansiedad", "Fomenta conexión emocional"],
                    qr_incluye: ["Significado de los aromas", "Ideas románticas", "Mensaje de amor personalizado"]
                }
            },
            {
                id: 4,
                nombre: "Velas Serenidad",
                linea: "Meditación",
                descripcion: "Aromas de sándalo y jazmín para meditación profunda y conexión espiritual.",
                precio: 15000,
                icono: "om",
                color: "info",
                imagen: "productos/Velas-Serenidad.png",
                qr_url: "qr-codes/producto-4.png",
                detalles: {
                    aromas: ["Sándalo", "Jazmín", "Incienso"],
                    duracion: "50-60 horas",
                    beneficios: ["Profundiza meditación", "Conecta con espiritualidad", "Promueve paz interior"],
                    qr_incluye: ["Guías de meditación", "Mantras", "Mensaje espiritual"]
                }
            },
            {
                id: 5,
                nombre: "Velas Pureza",
                linea: "Bienestar",
                descripcion: "Esencias de eucalipto y menta para purificación y claridad mental.",
                precio: 15000,
                icono: "leaf",
                color: "success",
                imagen: "productos/velas-pureza.png",
                qr_url: "qr-codes/producto-5.png",
                detalles: {
                    aromas: ["Eucalipto", "Menta", "Pino"],
                    duracion: "45-55 horas",
                    beneficios: ["Purifica el ambiente", "Aclara la mente", "Refresca el espacio"],
                    qr_incluye: ["Propiedades purificadoras", "Técnicas de limpieza energética", "Mensaje de claridad"]
                }
            },
            {
                id: 6,
                nombre: "Velas Alegría",
                linea: "Felicidad",
                descripcion: "Frutas tropicales y vainilla para momentos de alegría y positividad.",
                precio: 15000,
                icono: "smile",
                color: "warning",
                imagen: "productos/velas-alegria.png",
                qr_url: "qr-codes/producto-6.png",
                detalles: {
                    aromas: ["Piña", "Coco", "Vainilla"],
                    duracion: "40-50 horas",
                    beneficios: ["Levanta el ánimo", "Crea positividad", "Estimula felicidad"],
                    qr_incluye: ["Beneficios emocionales", "Afirmaciones positivas", "Mensaje alegre"]
                }
            },
            {
                id: 7,
                nombre: "Velas Armonía",
                linea: "Equilibrio",
                descripcion: "Mezcla equilibrada de aromas para armonía espiritual y paz interior.",
                precio: 15000,
                icono: "balance-scale",
                color: "primary",
                imagen: "productos/velas-armonia.png",
                qr_url: "qr-codes/producto-7.png",
                detalles: {
                    aromas: ["Lavanda", "Sándalo", "Rosa"],
                    duracion: "50-60 horas",
                    beneficios: ["Equilibra energías", "Promueve armonía", "Fomenta bienestar"],
                    qr_incluye: ["Técnicas de equilibrio", "Mandala de armonía", "Mensaje equilibrante"]
                }
            },
            {
                id: 8,
                nombre: "Velas Sueños",
                linea: "Descanso",
                descripcion: "Lavanda y camomila para un sueño reparador y descanso profundo.",
                precio: 15000,
                icono: "moon",
                color: "info",
                imagen: "productos/velas-suenos.png",
                qr_url: "qr-codes/producto-8.png",
                detalles: {
                    aromas: ["Lavanda", "Camomila", "Melisa"],
                    duracion: "45-55 horas",
                    beneficios: ["Facilita el sueño", "Reduce insomnio", "Promueve descanso"],
                    qr_incluye: ["Rutinas de sueño", "Historias relajantes", "Mensaje de buenas noches"]
                }
            }
        ];
    }

    // Obtener todos los productos
    getAllProductos() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.productos]);
            }, 100); // Simula delay de red
        });
    }

    // Obtener producto por ID
    getProductoById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const producto = this.productos.find(p => p.id === id);
                if (producto) {
                    resolve({...producto});
                } else {
                    reject(new Error('Producto no encontrado'));
                }
            }, 100);
        });
    }

    // Obtener productos por línea
    getProductosByLinea(linea) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const productos = this.productos.filter(p =>
                    p.linea.toLowerCase() === linea.toLowerCase()
                );
                resolve([...productos]);
            }, 100);
        });
    }

    // Buscar productos por nombre o descripción
    searchProductos(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const resultados = this.productos.filter(p =>
                    p.nombre.toLowerCase().includes(query.toLowerCase()) ||
                    p.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                    p.linea.toLowerCase().includes(query.toLowerCase())
                );
                resolve([...resultados]);
            }, 100);
        });
    }

    // Obtener líneas de productos disponibles
    getLineasDisponibles() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lineas = [...new Set(this.productos.map(p => p.linea))];
                resolve(lineas);
            }, 100);
        });
    }

    // Simular agregar al carrito (para futuras funcionalidades)
    addToCart(productoId, cantidad = 1) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: `Producto ${productoId} agregado al carrito (${cantidad} unidades)`
                });
            }, 200);
        });
    }
}

// Instancia global de la API
const productosAPI = new ProductosAPI();

// Funciones de utilidad para el frontend
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function getIconClass(icono) {
    return `fas fa-${icono} fa-3x mb-3`;
}

function getColorClass(color) {
    return `bg-gradient-${color}`;
}

// Exportar para uso en módulos (si se usa bundler)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductosAPI, productosAPI, formatPrice, getIconClass, getColorClass };
}