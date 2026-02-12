const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendor = sequelize.define('Vendor', {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    rate: { type: DataTypes.FLOAT, defaultValue: 60 },
    availableMilk: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Vendor;
