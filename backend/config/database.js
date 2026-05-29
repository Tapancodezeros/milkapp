const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'milkapp',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || 'Admin@123',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ PostgreSQL Connected Successfully');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to PostgreSQL:', error);
  });

module.exports = sequelize;