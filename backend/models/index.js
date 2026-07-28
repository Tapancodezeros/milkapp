const sequelize = require('../config/database');
const Customer = require('./Customer');
const Vendor = require('./Vendor');
const Admin = require('./Admin');
const Transaction = require('./Transaction');
const Subscription = require('./Subscription');
const InventoryHistory = require('./InventoryHistory');
const WeatherAdvisory = require('./WeatherAdvisory');

// Associations
Customer.hasMany(Transaction, { foreignKey: 'customerId' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId' });

Vendor.hasMany(Transaction, { foreignKey: 'vendorId' });
Transaction.belongsTo(Vendor, { foreignKey: 'vendorId' });

Customer.hasMany(Subscription, { foreignKey: 'customerId' });
Subscription.belongsTo(Customer, { foreignKey: 'customerId' });

Vendor.hasMany(Subscription, { foreignKey: 'vendorId' });
Subscription.belongsTo(Vendor, { foreignKey: 'vendorId' });

Vendor.hasMany(InventoryHistory, { foreignKey: 'vendorId' });
InventoryHistory.belongsTo(Vendor, { foreignKey: 'vendorId' });

Vendor.hasMany(WeatherAdvisory, { foreignKey: 'vendorId' });
WeatherAdvisory.belongsTo(Vendor, { foreignKey: 'vendorId' });

module.exports = {
  sequelize,
  Customer,
  Vendor,
  Admin,
  Transaction,
  Subscription,
  InventoryHistory,
  WeatherAdvisory
};
