const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con éxito.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };