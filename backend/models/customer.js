module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  });
  Customer.associate = (models) => {
    Customer.hasMany(models.DailyLog, { foreignKey: 'customerId' });
  };
  return Customer;
};