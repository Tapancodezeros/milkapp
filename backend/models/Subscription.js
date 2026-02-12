const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'paused', 'cancelled'), defaultValue: 'active' },
    duration: { type: DataTypes.ENUM('7_days', '1_month', '3_months'), allowNull: false },
    startDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    fixedRate: { type: DataTypes.FLOAT, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Subscription;
