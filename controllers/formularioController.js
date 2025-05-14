const Formulario = require('../models/Formulario');

// Crear un nuevo formulario
const createFormulario = async (req, res) => {
    try {
        const nuevoFormulario = await Formulario.create({});
        res.status(201).json(nuevoFormulario);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear el formulario' });
    }
};

// Obtener todos los formularios
const getFormularios = async (req, res) => {
    try {
        const formularios = await Formulario.findAll();
        res.status(200).json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los formularios' });
    }
};

module.exports = { createFormulario, getFormularios };