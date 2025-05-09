const express = require('express');
const path = require('path');

const { v4: uuidv4 } = require('uuid'); // Importar el generador de UUID
const app = express();
const router = express.Router();

// Middleware to serve static files from the "public" directory
app.use('/my-app', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Redirigir a /my-app si el contexto no está presente
app.get('/', (req, res) => {
  res.redirect('/my-app');
});

// Ruta para generar el UUID y enviarlo al cliente
router.get('/uuid', (req, res) => {
    const uid = uuidv4();
    res.json({ uuid: uid });
});

// Define routes within the router
router.get('/about', (req, res) => {
  res.send('About page under context path');
});

// Mount the router on a context path
app.use('/my-app', router);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
