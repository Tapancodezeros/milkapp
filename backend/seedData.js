require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin, Customer, Vendor, Subscription, Transaction, InventoryHistory } = require('./models');

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const shouldReset = process.argv.includes('--reset');

const transactionBlueprints = (vendorRecords, customerRecords, today) => [
  {
    date: formatDate(addDays(today, -45)),
    quantity: 1.5,
    amount: 1.5 * vendorRecords[0].rate,
    status: 'completed',
    type: 'purchase',
    deliveryStatus: 'delivered',
    customerId: customerRecords[0].id,
    vendorId: vendorRecords[0].id,
  },
  {
    date: formatDate(addDays(today, -30)),
    quantity: 2,
    amount: 2 * vendorRecords[1].rate,
    status: 'completed',
    type: 'subscription',
    deliveryStatus: 'delivered',
    customerId: customerRecords[1].id,
    vendorId: vendorRecords[1].id,
  },
  {
    date: formatDate(addDays(today, -14)),
    quantity: 3,
    amount: 3 * vendorRecords[0].rate,
    status: 'completed',
    type: 'purchase',
    deliveryStatus: 'not_delivered',
    customerId: customerRecords[2].id,
    vendorId: vendorRecords[0].id,
  },
  {
    date: formatDate(addDays(today, -7)),
    quantity: 1,
    amount: 1 * vendorRecords[2].rate,
    status: 'completed',
    type: 'purchase',
    deliveryStatus: 'delivered',
    customerId: customerRecords[3].id,
    vendorId: vendorRecords[2].id,
  },
  {
    date: formatDate(addDays(today, -3)),
    quantity: 2,
    amount: 2 * vendorRecords[2].rate,
    status: 'pending',
    type: 'subscription',
    deliveryStatus: 'pending',
    customerId: customerRecords[0].id,
    vendorId: vendorRecords[2].id,
  },
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

const seedData = async () => {
  let exitCode = 0;

  try {
    await sequelize.sync(shouldReset ? { force: true } : { alter: true });

    if (shouldReset) {
      console.log('♻️  Database reset enabled. Recreating demo data from scratch.');
    }

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
      {
        name: 'Morning Bell Dairy',
        phone: '0800777888',
        email: 'morningbell@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 62,
        availableMilk: 150,
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
      {
        name: 'David Kumar',
        phone: '0811000004',
        email: 'david@milkapp.com',
        password: await bcrypt.hash('customer123', 10),
        walletBalance: 575,
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

    for (const vendor of vendorRecords) {
      const historySeed = [
        { vendorId: vendor.id, amount: 60, date: formatDate(addDays(new Date(), -6)) },
        { vendorId: vendor.id, amount: 40, date: formatDate(addDays(new Date(), -3)) },
        { vendorId: vendor.id, amount: -15, date: formatDate(addDays(new Date(), -1)) },
      ];

      for (const entry of historySeed) {
        await InventoryHistory.findOrCreate({
          where: {
            vendorId: entry.vendorId,
            date: entry.date,
            amount: entry.amount,
          },
          defaults: entry,
        });
      }
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
      {
        quantity: 1,
        duration: '1_month',
        startDate: formatDate(addDays(today, -10)),
        endDate: formatDate(addDays(today, 20)),
        fixedRate: vendorRecords[2].rate,
        customerId: customerRecords[3].id,
        vendorId: vendorRecords[2].id,
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

    const transactions = transactionBlueprints(vendorRecords, customerRecords, today);

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
  } catch (error) {
    exitCode = 1;
    console.error('❌ Seed data failed:', error);
  } finally {
    await sequelize.close();
    process.exitCode = exitCode;
  }
};

seedData();
