const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherAdvisory = sequelize.define('WeatherAdvisory', {
    isRainyMode: { type: DataTypes.BOOLEAN, defaultValue: false },
    severity: { type: DataTypes.ENUM('light', 'moderate', 'heavy'), defaultValue: 'moderate' },
    advisoryTitle: { type: DataTypes.STRING, defaultValue: 'Rainy Weather Alert' },
    advisoryMessage: { 
        type: DataTypes.TEXT, 
        defaultValue: 'Heavy rainfall in delivery zone. Milk deliveries are dispatched with rainproof protective covers.' 
    },
    estimatedDelayMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
    vendorId: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = WeatherAdvisory;
