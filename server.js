// app.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;


app.use('/', express.static(path.join(__dirname, 'public')));

// Ruta principal: acceso no autorizado
app.get('/', (req, res) => {
    res.status(403).send(`
        <h1>403 - Acceso no autorizado</h1>
        <p>No puedes acceder directamente a esta página.</p>
        <a href="/form/">Ir al formulario</a>
    `);
});

// Middleware para servir archivos estáticos

// Ruta principal que genera el GUID y redirige
app.get('/form/', (req, res) => {
    const guid = uuidv4();
    console.log("guid: =", guid)
    res.redirect(`/form/${guid}`);
});

// Ruta dinámica del formulario con el GUID
app.get('/form/:guid', (req, res) => {
    const { guid } = req.params;
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log(`GUID generado: ${guid}`);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
