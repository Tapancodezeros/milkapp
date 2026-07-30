const { DataTypes } = require('sequelize');
const { primaryDb } = require('../config/database');

const Admin = primaryDb.define('Admin', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
});

module.exports = Admin;