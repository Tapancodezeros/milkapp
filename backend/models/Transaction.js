const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'completed' },
    type: { type: DataTypes.ENUM('subscription', 'purchase'), defaultValue: 'purchase' },
    deliveryStatus: { type: DataTypes.ENUM('pending', 'delivered', 'not_delivered'), defaultValue: 'pending' },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Transaction;
