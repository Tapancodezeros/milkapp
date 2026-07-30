const { DataTypes } = require('sequelize');
const { customerDb } = require('../config/database');

const Customer = customerDb.define('Customer', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    walletBalance: { type: DataTypes.FLOAT, defaultValue: 0 },
    rainproofPackaging: { type: DataTypes.BOOLEAN, defaultValue: false },
    rainDropoffInstructions: { type: DataTypes.STRING, allowNull: true },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
});

module.exports = Customer;
