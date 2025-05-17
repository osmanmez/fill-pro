const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePathDepartamentos = path.join(__dirname, '../data/itemsDepartamento.json');
const filePathMunicipio = path.join(__dirname, '../data/itemsMunicipios.json');

router.get('/departamentos', (req, res) => {
    fs.readFile(filePathDepartamentos, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Error reading data -' + err });
            return;
        }
        res.json(JSON.parse(data));
    });
});

router.get('/municipios', (req, res) => {
    fs.readFile(filePathMunicipio, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Error reading data -' + err });
            return;
        }
        res.json(JSON.parse(data));
    });
});

module.exports = router;