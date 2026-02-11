module.exports = (sequelize, DataTypes) => {
  const DailyLog = sequelize.define('DailyLog', {
    date: DataTypes.DATEONLY,
    quantity: DataTypes.FLOAT,
    pricePerLiter: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT
  });
  DailyLog.associate = (models) => {
    DailyLog.belongsTo(models.Customer, { foreignKey: 'customerId' });
  };
  return DailyLog;
};