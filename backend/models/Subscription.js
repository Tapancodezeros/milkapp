const { DataTypes } = require('sequelize');
const { customerDb } = require('../config/database');

const Subscription = customerDb.define('Subscription', {
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'paused', 'cancelled'), defaultValue: 'active' },
    duration: { type: DataTypes.ENUM('7_days', '1_month', '3_months'), allowNull: false },
    startDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    fixedRate: { type: DataTypes.FLOAT, allowNull: false },
    deliveryTime: { type: DataTypes.STRING, defaultValue: '07:00 AM', allowNull: true },
    rainPausedDates: { type: DataTypes.TEXT, defaultValue: '[]' },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Subscription;
