const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryHistory = sequelize.define('InventoryHistory', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = InventoryHistory;
