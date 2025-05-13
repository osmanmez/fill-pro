const PDFDocument = require('pdfkit');
const fs = require('fs');

function createPDF(filePath, callback) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Crear la tabla con el formato de la imagen
    doc.fontSize(12).fillColor('black');
    doc.rect(50, 50, 500, 30).fill('#dce6f1').stroke();
    doc.text('Título académico:', 55, 55);
    doc.text('Nivel académico:', 55, 75);
    doc.text('Renglón Presupuestario:', 250, 75);
    doc.text('Escalafón:', 450, 75);

    doc.rect(150, 55, 300, 20).stroke(); // Campo de texto para Título académico
    doc.rect(150, 75, 100, 20).stroke(); // Campo de texto para Nivel académico
    doc.rect(400, 75, 50, 20).stroke();  // Campo de texto para Renglón Presupuestario
    doc.rect(500, 75, 50, 20).stroke();  // Campo de texto para Escalafón

    doc.end();
    console.log('PDF generado: ' + filePath);
    callback();
}

module.exports = { createPDF };
