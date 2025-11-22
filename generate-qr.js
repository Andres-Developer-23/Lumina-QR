const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Productos con IDs
const productos = [
    { id: 1, nombre: "Velas Relax" },
    { id: 2, nombre: "Velas Energía" },
    { id: 3, nombre: "Velas Amor" },
    { id: 4, nombre: "Velas Serenidad" },
    { id: 5, nombre: "Velas Pureza" },
    { id: 6, nombre: "Velas Alegría" },
    { id: 7, nombre: "Velas Armonía" },
    { id: 8, nombre: "Velas Sueños" }
];

const qrDir = path.join(__dirname, 'qr-codes');

// Crear directorio si no existe
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir);
}

// Generar QR para cada producto
productos.forEach(async (producto) => {
    const url = `qr-info.html?id=${producto.id}`;
    const filePath = path.join(qrDir, `producto-${producto.id}.png`);

    try {
        await QRCode.toFile(filePath, url, {
            width: 300,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        console.log(`QR generado para ${producto.nombre}: ${filePath}`);
    } catch (error) {
        console.error(`Error generando QR para ${producto.nombre}:`, error);
    }
});