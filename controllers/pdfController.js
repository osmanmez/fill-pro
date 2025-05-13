const { createDirectorPDF } = require('../utils/pdfGenerator2');

async function generateDirectorPDF(req, res) {
    try {
        const requiredFields = ['name', 'address', 'municipio', 'departamento', 'telefono', 'email', 'birthDate', 'dpi', 'genero', 'titulo', 'nivel', 'renglon', 'escalafon'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const pdfBuffer = await createDirectorPDF(req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=director.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error.message);
        res.status(500).send({ error: 'Error generating PDF', details: error.message });
    }
}

module.exports = { generateDirectorPDF };
