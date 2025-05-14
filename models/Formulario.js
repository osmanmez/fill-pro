const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Formulario = sequelize.define('formulario', {
    id_formulario: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'formulario',
    timestamps: false,
});

module.exports = Formulario;