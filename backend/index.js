require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

// --- MIDDLEWARE ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.97.100:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'milk_app',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

// --- MODELS ---

const Customer = sequelize.define('Customer', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true }, // Changed to true to support existing data
  password: { type: DataTypes.STRING, allowNull: true },
  walletBalance: { type: DataTypes.FLOAT, defaultValue: 0 },
});

const Vendor = sequelize.define('Vendor', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  rate: { type: DataTypes.FLOAT, defaultValue: 60 }, // Default milk rate
  availableMilk: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Transaction = sequelize.define('Transaction', {
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  quantity: { type: DataTypes.FLOAT, allowNull: false }, // Liters
  amount: { type: DataTypes.FLOAT, allowNull: false },   // Total Price
  status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'completed' },
  type: { type: DataTypes.ENUM('subscription', 'purchase'), defaultValue: 'purchase' },
  deliveryStatus: { type: DataTypes.ENUM('pending', 'delivered', 'not_delivered'), defaultValue: 'pending' },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

const Subscription = sequelize.define('Subscription', {
  quantity: { type: DataTypes.FLOAT, allowNull: false }, // Daily Liters
  status: { type: DataTypes.ENUM('active', 'paused', 'cancelled'), defaultValue: 'active' },
  duration: { type: DataTypes.ENUM('7_days', '1_month', '3_months'), allowNull: false },
  startDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  fixedRate: { type: DataTypes.FLOAT, allowNull: false },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

const InventoryHistory = sequelize.define('InventoryHistory', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  vendorId: { type: DataTypes.INTEGER, allowNull: false }
});

// Relationships
Customer.hasMany(Transaction, { foreignKey: 'customerId' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId' });

Vendor.hasMany(Transaction, { foreignKey: 'vendorId' });
Transaction.belongsTo(Vendor, { foreignKey: 'vendorId' });

Customer.hasMany(Subscription, { foreignKey: 'customerId' });
Subscription.belongsTo(Customer, { foreignKey: 'customerId' });

Vendor.hasMany(Subscription, { foreignKey: 'vendorId' });
Subscription.belongsTo(Vendor, { foreignKey: 'vendorId' });

Vendor.hasMany(InventoryHistory, { foreignKey: 'vendorId' });
InventoryHistory.belongsTo(Vendor, { foreignKey: 'vendorId' });

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access Denied" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Auth
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    // Limits & Validation
    if (!name || name.length < 2 || name.length > 50) return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
    if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (!['customer', 'vendor'].includes(role)) return res.status(400).json({ error: "Invalid role" });
    if (!email || !email.includes('@')) return res.status(400).json({ error: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const Model = role === 'vendor' ? Vendor : Customer;

    const user = await Model.create({ name, phone, email, password: hashedPassword });
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === 'vendor' ? Vendor : Customer;

    const user = await Model.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscription Management
app.post('/api/subscribe', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ error: "Only customers can subscribe" });
    const { vendorId, quantity, duration } = req.body;

    // Business Limits
    if (!quantity || quantity < 0.1 || quantity > 50) return res.status(400).json({ error: "Quantity must be between 0.1L and 50L per day" });

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    // Check for existing active/paused subscription with this vendor
    const existingSub = await Subscription.findOne({
      where: {
        customerId: req.user.id,
        vendorId,
        status: ['active', 'paused']
      }
    });

    if (existingSub) {
      return res.status(400).json({ error: "You already have an active or paused subscription with this vendor." });
    }

    const startDate = new Date();
    const endDate = new Date();

    if (duration === '7_days') endDate.setDate(startDate.getDate() + 7);
    else if (duration === '1_month') endDate.setMonth(startDate.getMonth() + 1);
    else if (duration === '3_months') endDate.setMonth(startDate.getMonth() + 3);
    else return res.status(400).json({ error: "Invalid duration" });

    const sub = await Subscription.create({
      customerId: req.user.id,
      vendorId,
      quantity,
      duration,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      fixedRate: vendor.rate
    });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    const where = role === 'vendor' ? { vendorId: id } : { customerId: id };
    const include = role === 'vendor'
      ? [{ model: Customer, attributes: ['name', 'phone', 'email'] }]
      : [{ model: Vendor, attributes: ['name', 'rate'] }];

    const subs = await Subscription.findAll({ where, include });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { status, quantity } = req.body;
    const sub = await Subscription.findByPk(req.params.id);

    if (!sub) return res.status(404).json({ error: "Subscription not found" });

    // Authorization: Only owner (customer) or vendor can update
    if (req.user.role === 'customer' && sub.customerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (req.user.role === 'vendor' && sub.vendorId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (status) sub.status = status;
    if (quantity !== undefined) sub.quantity = quantity;
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/subscriptions/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const sub = await Subscription.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    if (sub.customerId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    sub.status = sub.status === 'active' ? 'paused' : 'active';
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/subscriptions/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const sub = await Subscription.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    if (sub.customerId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    sub.status = 'cancelled';
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendor/process-subscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });

    const today = new Date().toISOString().split('T')[0];
    const vendor = await Vendor.findByPk(req.user.id);
    const subs = await Subscription.findAll({ where: { vendorId: req.user.id, status: 'active' } });

    const existingTransactions = await Transaction.count({
      where: {
        vendorId: req.user.id,
        date: today,
        status: 'pending' // Assuming only pending subscription orders matter
      }
    });

    // Removed global blocking check to allow partial processing

    let processedCount = 0;
    let skippedCount = 0;

    for (const sub of subs) {
      // Check if expired
      if (sub.endDate && sub.endDate < today) {
        sub.status = 'cancelled';
        await sub.save();
        skippedCount++;
        continue;
      }

      // Check if ALREADY processed for this customer today
      const alreadyProcessed = await Transaction.findOne({
        where: {
          vendorId: req.user.id,
          customerId: sub.customerId,
          date: today,
          type: 'subscription'
        }
      });

      if (alreadyProcessed) {
        skippedCount++;
        continue;
      }

      if (vendor.availableMilk >= sub.quantity) {
        const amount = sub.quantity * sub.fixedRate;

        // Subscriptions now start as pending, user pays manually from dashboard
        const status = 'pending';

        await Transaction.create({
          customerId: sub.customerId,
          vendorId: vendor.id,
          quantity: sub.quantity,
          amount,
          status,
          type: 'subscription'
        });

        vendor.availableMilk -= sub.quantity;
        processedCount++;
      }
    }

    await vendor.save();
    res.json({ message: `Processed ${processedCount} new orders. (Skipped ${skippedCount} already processed)`, remainingMilk: vendor.availableMilk });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Vendor Management
app.get('/api/vendor/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });
    const vendor = await Vendor.findByPk(req.user.id, { attributes: ['id', 'name', 'rate', 'availableMilk'] });

    // Check if processed today
    const today = new Date().toISOString().split('T')[0];
    const processedCount = await Transaction.count({
      where: {
        vendorId: req.user.id,
        date: today,
        status: 'pending'
      }
    });

    res.json({ ...vendor.toJSON(), todayProcessed: processedCount > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vendor/update', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });
    const { rate, addMilk } = req.body;

    const vendor = await Vendor.findByPk(req.user.id);

    if (rate !== undefined) {
      if (rate < 20 || rate > 200) return res.status(400).json({ error: "Milk rate must be between ₹20 and ₹200 per liter" });
      vendor.rate = rate;
    }

    if (addMilk !== undefined) {
      const milkToAdd = parseFloat(addMilk);
      if (isNaN(milkToAdd) || milkToAdd <= 0) {
        return res.status(400).json({ error: "Add amount must be greater than 0" });
      }

      const newTotal = (parseFloat(vendor.availableMilk) || 0) + milkToAdd;
      if (newTotal > 1000) {
        return res.status(400).json({ error: `Cannot exceed total stock of 1000L. Current: ${vendor.availableMilk}L, Max possible add: ${1000 - vendor.availableMilk}L` });
      }

      vendor.availableMilk = newTotal;
      await InventoryHistory.create({ vendorId: req.user.id, amount: milkToAdd });
    }

    await vendor.save();
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Data
app.get('/api/vendors', authenticateToken, async (req, res) => {
  try {
    const vendors = await Vendor.findAll({ attributes: ['id', 'name', 'phone', 'email', 'rate', 'availableMilk'] });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/buy', authenticateToken, async (req, res) => {
  try {
    // Only customers can buy
    if (req.user.role !== 'customer') return res.status(403).json({ error: "Only customers can buy milk" });

    const { vendorId, quantity } = req.body;

    // Transaction Limits
    if (!quantity || quantity < 0.1 || quantity > 100) return res.status(400).json({ error: "Purchase quantity must be between 0.1L and 100L" });

    // Fetch vendor
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    // Check Stock
    if (vendor.availableMilk < quantity) {
      return res.status(400).json({ error: `Not enough milk. Available: ${vendor.availableMilk} L` });
    }

    const rate = vendor.rate;
    const amount = quantity * rate;

    // Check Wallet Balance
    const customer = await Customer.findByPk(req.user.id);
    if (!customer || customer.walletBalance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance. Please top up." });
    }

    const transaction = await Transaction.create({
      customerId: req.user.id,
      vendorId,
      quantity,
      amount,
      status: 'completed',
      type: 'purchase'
    });

    // Deduct Wallet & Stock
    customer.walletBalance -= amount;
    await customer.save();

    vendor.availableMilk -= quantity;
    await vendor.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    const { page = 1, limit = 10, paginate = 'false' } = req.query;

    const where = role === 'vendor' ? { vendorId: id } : { customerId: id };
    const include = role === 'vendor'
      ? [{ model: Customer, attributes: ['name', 'phone'] }]
      : [{ model: Vendor, attributes: ['name', 'phone'] }];

    if (paginate === 'true') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { count, rows } = await Transaction.findAndCountAll({
        where,
        include,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return res.json({
        data: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit))
      });
    }

    const transactions = await Transaction.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']]
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transactions/:id/verify', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    // Only customer can verify
    if (req.user.id !== transaction.customerId) return res.status(403).json({ error: "Unauthorized" });

    const { status } = req.body; // 'delivered' or 'not_delivered'
    if (!['delivered', 'not_delivered'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Use 'delivered' or 'not_delivered'." });
    }

    transaction.deliveryStatus = status;
    await transaction.save();

    const updatedTransaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: Vendor, attributes: ['name', 'phone'] }]
    });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transactions/:id/delivery', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Only vendors can updates delivery" });

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    if (transaction.vendorId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const { status } = req.body; // 'delivered' or 'not_delivered'
    if (!['delivered', 'not_delivered'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Use 'delivered' or 'not_delivered'." });
    }

    transaction.deliveryStatus = status;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transactions/:id/pay', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ error: "Only customers can pay" });

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    if (transaction.customerId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
    if (transaction.status !== 'pending') return res.status(400).json({ error: "Transaction is not pending" });

    const customer = await Customer.findByPk(req.user.id);
    if (customer.walletBalance < transaction.amount) {
      return res.status(400).json({ error: "Insufficient wallet balance. Please top up." });
    }

    // Deduct and Update
    customer.walletBalance -= transaction.amount;
    await customer.save();

    transaction.status = 'completed';
    await transaction.save();

    res.json({ message: "Payment successful", balance: customer.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    const where = role === 'vendor' ? { vendorId: id } : { customerId: id };

    const transactions = await Transaction.findAll({ where });

    let totalPaid = 0;
    let totalPending = 0;

    transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.status === 'completed') {
        totalPaid += amt;
      } else if (t.status === 'pending') {
        totalPending += amt;
      }
    });

    res.json({ totalPaid, totalPending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customer/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ error: "Not a customer" });
    const customer = await Customer.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'phone', 'walletBalance'] });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customer/topup', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ error: "Not a customer" });
    const { amount } = req.body;

    // Monetary Limits
    if (!amount || amount < 10 || amount > 50000) {
      return res.status(400).json({ error: "Topup amount must be between ₹10 and ₹50,000" });
    }

    const customer = await Customer.findByPk(req.user.id);
    const newBalance = (parseFloat(customer.walletBalance) || 0) + parseFloat(amount);

    if (newBalance > 50000) {
      return res.status(400).json({ error: `Wallet balance cannot exceed ₹50,000. Current: ₹${customer.walletBalance}, Max top-up allowed: ₹${50000 - customer.walletBalance}` });
    }

    customer.walletBalance = newBalance;
    await customer.save();
    res.json({ message: "Topup successful", balance: customer.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vendor/inventory-history', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });
    const history = await InventoryHistory.findAll({
      where: { vendorId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vendor/reports', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });

    // Simple monthly aggregation logic
    const transactions = await Transaction.findAll({ where: { vendorId: req.user.id } });
    const monthlyData = {};

    transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, volume: 0 };
      monthlyData[month].revenue += parseFloat(t.amount);
      monthlyData[month].volume += parseFloat(t.quantity);
    });

    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SERVER START ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to PostgreSQL on port ${process.env.DB_PORT || 5433}`);
    await sequelize.sync({ alter: true }); // Automatically updates tables
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server Cluster Active:`);
      console.log(`   🏠 Local:   http://localhost:${PORT}`);
      console.log(`   🌐 Network: http://192.168.97.100:${PORT}`);
    });
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
  }
}
startServer();