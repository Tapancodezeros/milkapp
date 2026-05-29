require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin, Customer, Vendor, Subscription, Transaction } = require('./models');

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const seedData = async () => {
  try {
    await sequelize.sync({ alter: true });

    const adminPassword = await bcrypt.hash('admin123', 10);
    await Admin.findOrCreate({
      where: { email: 'admin@milkapp.com' },
      defaults: {
        name: 'System Admin',
        phone: '0000000000',
        email: 'admin@milkapp.com',
        password: adminPassword,
      },
    });

    const vendors = [
      {
        name: 'Dairy King',
        phone: '0800123456',
        email: 'dairyking@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 65,
        availableMilk: 120,
        isAvailable: true,
      },
      {
        name: 'Green Pastures',
        phone: '0800654321',
        email: 'greenpastures@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 70,
        availableMilk: 80,
        isAvailable: true,
      },
    ];

    const customerData = [
      {
        name: 'Alice Johnson',
        phone: '0811000001',
        email: 'alice@milkapp.com',
        password: await bcrypt.hash('customer123', 10),
        walletBalance: 350,
      },
      {
        name: 'Bob Martin',
        phone: '0811000002',
        email: 'bob@milkapp.com',
        password: await bcrypt.hash('customer123', 10),
        walletBalance: 220,
      },
      {
        name: 'Cathy Lee',
        phone: '0811000003',
        email: 'cathy@milkapp.com',
        password: await bcrypt.hash('customer123', 10),
        walletBalance: 410,
      },
    ];

    const vendorRecords = [];
    for (const vendor of vendors) {
      const [record] = await Vendor.findOrCreate({
        where: { email: vendor.email },
        defaults: vendor,
      });
      vendorRecords.push(record);
    }

    const customerRecords = [];
    for (const customer of customerData) {
      const [record] = await Customer.findOrCreate({
        where: { email: customer.email },
        defaults: customer,
      });
      customerRecords.push(record);
    }

    const today = new Date();

    const subscriptions = [
      {
        quantity: 2,
        duration: '1_month',
        startDate: formatDate(today),
        endDate: formatDate(addDays(today, 30)),
        fixedRate: vendorRecords[0].rate,
        customerId: customerRecords[0].id,
        vendorId: vendorRecords[0].id,
      },
      {
        quantity: 1.5,
        duration: '7_days',
        startDate: formatDate(today),
        endDate: formatDate(addDays(today, 7)),
        fixedRate: vendorRecords[1].rate,
        customerId: customerRecords[1].id,
        vendorId: vendorRecords[1].id,
      },
      {
        quantity: 3,
        duration: '3_months',
        startDate: formatDate(today),
        endDate: formatDate(addDays(today, 90)),
        fixedRate: vendorRecords[0].rate,
        customerId: customerRecords[2].id,
        vendorId: vendorRecords[0].id,
      },
    ];

    for (const subscription of subscriptions) {
      await Subscription.findOrCreate({
        where: {
          customerId: subscription.customerId,
          vendorId: subscription.vendorId,
          duration: subscription.duration,
          startDate: subscription.startDate,
        },
        defaults: subscription,
      });
    }

    const transactions = [
      {
        date: formatDate(today),
        quantity: 2,
        amount: 2 * vendorRecords[0].rate,
        status: 'completed',
        type: 'subscription',
        deliveryStatus: 'delivered',
        customerId: customerRecords[0].id,
        vendorId: vendorRecords[0].id,
      },
      {
        date: formatDate(today),
        quantity: 1.5,
        amount: 1.5 * vendorRecords[1].rate,
        status: 'completed',
        type: 'purchase',
        deliveryStatus: 'delivered',
        customerId: customerRecords[1].id,
        vendorId: vendorRecords[1].id,
      },
      {
        date: formatDate(today),
        quantity: 3,
        amount: 3 * vendorRecords[0].rate,
        status: 'pending',
        type: 'subscription',
        deliveryStatus: 'pending',
        customerId: customerRecords[2].id,
        vendorId: vendorRecords[0].id,
      },
    ];

    for (const transaction of transactions) {
      await Transaction.findOrCreate({
        where: {
          customerId: transaction.customerId,
          vendorId: transaction.vendorId,
          date: transaction.date,
          amount: transaction.amount,
        },
        defaults: transaction,
      });
    }

    console.log('✅ Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data failed:', error);
    process.exit(1);
  }
};

seedData();
