// Importación de dependencias
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Importación de rutas
const formularioRoutes = require('./routes/formularioRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/itemsRoutes');

// Configuración de dotenv
dotenv.config();

const apiUrl = process.env.API_URL;

// Crear una instancia de Express
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde el directorio "public"
app.use('/censo-2025/:uuid', express.static(path.join(__dirname, 'public')));

// Middleware para parsear los cuerpos de las peticiones en formato URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas de la API
app.use('/api', userRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api', formularioRoutes);
app.use('/api/items', apiRoutes);

// Redirección desde la raíz a /censo-2025
app.get('/', async (req, res) => {
  res.redirect(302, '/censo-2025');
});

// Redirección desde /censo-2025 a /censo-2025/{uuid}
app.get('/censo-2025', async (req, res) => {
  try {
    const response = await fetch(`${apiUrl}/api/formularios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data)
    if (data.id_formulario) {
      res.redirect(302, `/censo-2025/${data.id_formulario}`);
    } else {
      res.status(500).send('Error al generar el UUID');
    }
  } catch (error) {
    res.status(500).send('Error al conectar con la API');
  }
});

// Ruta que sirve el index.html estático
app.get('/censo-2025/:uuid', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/censo-2025', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
  }
};

startServer();