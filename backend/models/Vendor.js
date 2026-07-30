const { DataTypes } = require('sequelize');
const { primaryDb } = require('../config/database');

const Vendor = primaryDb.define('Vendor', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    rate: { type: DataTypes.FLOAT, defaultValue: 60 },
    availableMilk: { type: DataTypes.FLOAT, defaultValue: 0 },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Vendor;

