const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createHeader(doc, title, subtitle, logoPath) {
    try {
        const logoFullPath = path.join(__dirname, '../public/static', logoPath);
        if (fs.existsSync(logoFullPath)) {
            doc.image(logoFullPath, doc.page.width - 75, 10, { width: 50, height: 50 });
        } else {
            console.warn('Logo not found at path:', logoFullPath);
        }

        // Título principal
        doc.font('Helvetica-Bold').fontSize(14).text(title, { align: 'center', margin: 20 });
        doc.moveDown(0.2); // Baja un poco después del título

        // Subtítulo
        if (subtitle) {
            doc.font('Helvetica-Bold').fontSize(12).text(subtitle, { align: 'center', margin: 5 });
            doc.moveDown(1); // Baja más la línea después del subtítulo
        }
    } catch (error) {
        console.error('Error creating header:', error.message);
        throw new Error('Header creation failed');
    }
}

function createCell(doc, x, y, width, height, text, options = {}) {
    const {
        fillColor = 'white',
        borderColor = 'black',
        textColor = 'black',
        fontSize = 11,
        bold = false,
        borderWidthTop = 1,
        borderWidthRight = 1,
        borderWidthBottom = 1,
        borderWidthLeft = 1
    } = options;



    try {
        doc.rect(x, y, width, height).fillOpacity(1).fill(fillColor);

        if (borderWidthTop > 0) {
            doc.moveTo(x, y).lineTo(x + width, y).lineWidth(borderWidthTop).stroke(borderColor);
        }
        if (borderWidthRight > 0) {
            doc.moveTo(x + width, y).lineTo(x + width, y + height).lineWidth(borderWidthRight).stroke(borderColor);
        }
        if (borderWidthBottom > 0) {
            doc.moveTo(x, y + height).lineTo(x + width, y + height).lineWidth(borderWidthBottom).stroke(borderColor);
        }
        if (borderWidthLeft > 0) {
            doc.moveTo(x, y).lineTo(x, y + height).lineWidth(borderWidthLeft).stroke(borderColor);
        }

        const font = bold ? 'Helvetica-Bold' : 'Helvetica';
        doc.font(font).fillColor(textColor).fontSize(fontSize).text(text || '-', x + 5, y + 5, { width: width - 10, height: height - 10, align: 'left' });
    } catch (error) {
        console.error('Error creating cell:', error.message);
        throw new Error('Error creating cell content');
    }
}

function createRow(doc, x, y, cellData, options = {}) {

    let currentX = x;
    const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    cellData.forEach((cell) => {

        const cellWidth = cell.options?.width || 100;
        if (currentX + cellWidth > maxWidth) {
            console.warn('Cell width exceeds page margin, adjusting to fit.');
            return;
        }

        const cellOptions = {
            ...cell.options,
            bold: cell.options?.bold || false,
            borderWidthTop: cell.options?.borderWidthTop ?? 1,
            borderWidthRight: cell.options?.borderWidthRight ?? 1,
            borderWidthBottom: cell.options?.borderWidthBottom ?? 1,
            borderWidthLeft: cell.options?.borderWidthLeft ?? 1
        };

        createCell(doc, currentX, y, cellWidth, options.cellHeight || 30, cell.text, cellOptions);
        currentX += cellWidth;
    });
}

function createDirectorPDF(data, title = 'DIRECCIÓN GENERAL DE EDUCACIÓN FÍSICA DIGEF', subtitle = "COORDINACIÓN CURRICULAR CENSO 2025", logoPath = 'logo.png') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 20, size: 'A4' });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => {
            console.error('PDFKit Error:', err.message);
            reject(new Error('PDF creation failed'));
        });

        try {
            createHeader(doc, title, subtitle, logoPath);

            doc.font('Helvetica-Bold').fontSize(16).text("DATOS DEL DIRECTOR", { align: 'center', underline: false });
            doc.font('Helvetica');

            const rows = [
                [{ text: 'Nombre del director:', options: { fillColor: '#e0e0e0', width: 150, bold: true, borderWidthBottom: 0 } }, { text: data.name, options: { width: 350 } }],
                [{ text: 'Dirección del director:', options: { fillColor: '#e0e0e0', width: 150, bold: true, borderWidthTop: 0, borderWidthBottom: 0  } }, { text: data.address, options: { width: 350 } }],
                [{ text: 'Municipio:', options: { fillColor: '#e0e0e0', width: 80, bold: true, borderWidthTop: 0, borderWidthBottom: 0 } }, { text: data.municipio, options: { width: 150 } }, { text: 'Departamento:', options: { fillColor: '#e0e0e0', width: 100, bold: true } }, { text: data.departamento, options: { width: 170 } }],
                [{ text: 'Teléfono:', options: { fillColor: '#e0e0e0', width: 80, bold: true, borderWidthTop: 0, borderWidthBottom: 0 } }, { text: data.telefono, options: { width: 100 } }, { text: 'Correo electrónico:', options: { fillColor: '#e0e0e0', width: 150, bold: true } }, { text: data.email, options: { width: 170 } }],
                [{ text: 'Fecha de nacimiento:', options: { fillColor: '#e0e0e0', width: 130, bold: true, borderWidthTop: 0, borderWidthBottom: 0 } }, { text: data.birthDate, options: { width: 80 } }, { text: 'DPI:', options: { fillColor: '#e0e0e0', width: 40, bold: true } }, { text: data.dpi, options: { width: 100 } }, { text: 'Género:', options: { fillColor: '#e0e0e0', width: 80, bold: true } }, { text: data.genero, options: { width: 70 } }],
                [{ text: 'Título académico:', options: { fillColor: '#e0e0e0', width: 130, bold: true, borderWidthTop: 0, borderWidthBottom: 0 } }, { text: data.titulo, options: { width: 370 } }],
                [{ text: 'Nivel académico:', options: { fillColor: '#e0e0e0', width: 100, bold: true, borderWidthTop: 0 } }, { text: data.nivel, options: { width: 100 } }, { text: 'Renglón Presupuestario:', options: { fillColor: '#e0e0e0', width: 150, bold: true } }, { text: data.renglon, options: { width: 50 } }, { text: 'Escalafón:', options: { fillColor: '#e0e0e0', width: 70, bold: true } }, { text: data.escalafon, options: { width: 30 } }]
            ];

            let yPosition = 90;
            const xMargin = 45;
            rows.forEach(row => {
                createRow(doc, xMargin, yPosition, row, { ...row.options, cellHeight: 20 });
                yPosition += 20;
            });

            doc.end();
        } catch (error) {
            console.error('Error creating PDF structure:', error.message);
            reject(new Error('PDF structure generation failed'));
        }
    });
}

module.exports = { createDirectorPDF };
