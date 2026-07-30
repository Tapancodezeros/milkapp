const { primaryDb, customerDb, auditDb } = require('../config/database');
const Customer = require('./Customer');
const Vendor = require('./Vendor');
const Admin = require('./Admin');
const Transaction = require('./Transaction');
const Subscription = require('./Subscription');
const InventoryHistory = require('./InventoryHistory');
const WeatherAdvisory = require('./WeatherAdvisory');
const AuditLog = require('./AuditLog');

// Customer DB Associations (within customerDb)
Customer.hasMany(Transaction, { foreignKey: 'customerId' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(Subscription, { foreignKey: 'customerId' });
Subscription.belongsTo(Customer, { foreignKey: 'customerId' });

// Primary DB Associations (within primaryDb)
Vendor.hasMany(InventoryHistory, { foreignKey: 'vendorId' });
InventoryHistory.belongsTo(Vendor, { foreignKey: 'vendorId' });

Vendor.hasMany(WeatherAdvisory, { foreignKey: 'vendorId' });
WeatherAdvisory.belongsTo(Vendor, { foreignKey: 'vendorId' });

module.exports = {
  sequelize: primaryDb,
  primaryDb,
  customerDb,
  auditDb,
  Customer,
  Vendor,
  Admin,
  Transaction,
  Subscription,
  InventoryHistory,
  WeatherAdvisory,
  AuditLog
};
