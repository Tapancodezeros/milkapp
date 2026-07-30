const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config();

const commonOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
};

async function ensureDatabaseExists(dbName) {
  try {
    const client = new Client({
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Admin@123',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: 'postgres',
    });
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Created database "${dbName}"`);
    }
    await client.end();
  } catch (err) {
    // Non-blocking warning if postgres system database is restricted
  }
}

// Check/Create target databases if not existing
ensureDatabaseExists(process.env.DB_NAME || 'milkapp');
ensureDatabaseExists(process.env.DB2_NAME || 'milkapp_customer');
ensureDatabaseExists(process.env.DB_AUDIT_NAME || 'milkapp_audit');

const primaryDb = new Sequelize(
  process.env.DB_NAME || 'milkapp',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || 'Admin@123',
  commonOptions
);

const customerDb = new Sequelize(
  process.env.DB2_NAME || 'milkapp_customer',
  process.env.DB2_USERNAME || process.env.DB_USERNAME || 'postgres',
  process.env.DB2_PASSWORD || process.env.DB_PASSWORD || 'Admin@123',
  {
    ...commonOptions,
    host: process.env.DB2_HOST || commonOptions.host,
    port: process.env.DB2_PORT || commonOptions.port,
  }
);

const auditDb = new Sequelize(
  process.env.DB_AUDIT_NAME || 'milkapp_audit',
  process.env.DB_AUDIT_USERNAME || process.env.DB_USERNAME || 'postgres',
  process.env.DB_AUDIT_PASSWORD || process.env.DB_PASSWORD || 'Admin@123',
  {
    ...commonOptions,
    host: process.env.DB_AUDIT_HOST || commonOptions.host,
    port: process.env.DB_AUDIT_PORT || commonOptions.port,
  }
);

primaryDb.primaryDb = primaryDb;
primaryDb.customerDb = customerDb;
primaryDb.auditDb = auditDb;

module.exports = primaryDb;
module.exports.primaryDb = primaryDb;
module.exports.customerDb = customerDb;
module.exports.auditDb = auditDb;