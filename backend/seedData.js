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
      {
        name: 'PureCow Organics',
        phone: '0800111222',
        email: 'purecow@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 75,
        availableMilk: 200,
        isAvailable: true,
      },
      {
        name: 'Amulya Fresh Farms',
        phone: '0800333444',
        email: 'amulya@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 58,
        availableMilk: 90,
        isAvailable: true,
      },
      {
        name: 'Country Delight Dairy',
        phone: '0800555666',
        email: 'countrydelight@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 68,
        availableMilk: 180,
        isAvailable: true,
      },
      {
        name: 'Mother Dairy Express',
        phone: '0800777999',
        email: 'motherdairy@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 60,
        availableMilk: 250,
        isAvailable: true,
      },
      {
        name: 'Nandi Hills Organic',
        phone: '0800888111',
        email: 'nandihills@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 80,
        availableMilk: 100,
        isAvailable: true,
      },
      {
        name: 'Gou Ganga A2 Milk',
        phone: '0800999222',
        email: 'gouganga@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 85,
        availableMilk: 65,
        isAvailable: true,
      },
      {
        name: 'Sree Krishna Dairy',
        phone: '0800444888',
        email: 'sreekrishna@milkapp.com',
        password: await bcrypt.hash('vendor123', 10),
        rate: 64,
        availableMilk: 140,
        isAvailable: true,
      },
    ];

    const indianNames = [
      "Aarav Sharma", "Ananya Patel", "Rajesh Verma", "Priya Nair", "Vikram Singh",
      "Sneha Kulkarni", "Arjun Gupta", "Divya Iyer", "Amit Joshi", "Meera Reddy",
      "Rohan Mehta", "Kavya Deshmukh", "Aditya Rao", "Pooja Hegde", "Siddharth Malhotra",
      "Neha Choudhury", "Suresh Pillai", "Ritu Saxena", "Tarun Chawla", "Ishita Banerjee",
      "Varun Agarwal", "Deepa Bhatnagar", "Gaurav Bhatt", "Sunita Ranganathan", "Alok Mishra",
      "Swati Chatterji", "Nikhil Trivedi", "Shreya Ghoshal", "Manish Tripathi", "Aarti Shah",
      "Deepak Chauhan", "Preeti Grover", "Kunal Kapoor", "Shilpa Shetty", "Harish Nambiar",
      "Vandana Tyagi", "Pranav Sen", "Pallavi Mahajan", "Vivek Oberoi", "Madhuri Dixit",
      "Abhinav Bindra", "Tanvi Sethi", "Chirag Paswan", "Archana Puran", "Bhaskar Roy",
      "Rupa Ganguly", "Chetan Bhagat", "Smriti Irani", "Yash Vardhan", "Devika Rani"
    ];

    const customerPasswordHash = await bcrypt.hash('customer123', 10);

    const customerData = indianNames.map((name, index) => {
      const slug = name.toLowerCase().replace(/\s+/g, '.');
      const phoneDigits = String(9810000001 + index);
      return {
        name,
        phone: phoneDigits,
        email: `${slug}@milkapp.com`,
        password: customerPasswordHash,
        walletBalance: 3000,
      };
    });

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

      if (parseFloat(record.walletBalance) < 3000) {
        record.walletBalance = 3000;
        await record.save();
      }
      customerRecords.push(record);
    }

    const today = new Date();

    for (let i = 0; i < customerRecords.length; i++) {
      const customer = customerRecords[i];
      const vendor = vendorRecords[i % vendorRecords.length];
      const quantity = (i % 3) + 1;
      const durations = ['7_days', '1_month', '3_months'];
      const duration = durations[i % 3];
      const days = duration === '7_days' ? 7 : duration === '1_month' ? 30 : 90;

      await Subscription.findOrCreate({
        where: {
          customerId: customer.id,
          vendorId: vendor.id,
        },
        defaults: {
          quantity,
          duration,
          startDate: formatDate(today),
          endDate: formatDate(addDays(today, days)),
          fixedRate: vendor.rate,
          deliveryTime: '07:00 AM',
          status: 'active',
          customerId: customer.id,
          vendorId: vendor.id,
        },
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
