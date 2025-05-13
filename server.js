const express = require('express');
const path = require('path');
const pdfRoutes = require('./routes/pdfRoutes');
const { v4: uuidv4 } = require('uuid'); // Importar el generador de UUID
const userRoutes = require('./routes/userRoutes');
const app = express();
const router = express.Router();

// Middleware to serve static files from the "public" directory
app.use('/censo-2025', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/pdf', pdfRoutes);

// Redirigir a /my-app si el contexto no está presente
app.get('/', (req, res) => {
  res.redirect('/censo-2025');
});

// Ruta para generar el UUID y enviarlo al cliente
router.get('/uuid', (req, res) => {
    const uid = uuidv4();
    res.json({ uuid: uid });
});

// Mount the router on a context path
app.use('/censo-2025', router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
