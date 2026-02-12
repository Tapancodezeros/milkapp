const express = require('express');
const router = express.Router();
const { Transaction, Customer, Vendor } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');

// POST /api/buy
router.post('/buy', authenticateToken, Validation.buy, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return res.status(403).json({ error: "Only customers can buy milk" });
        const { vendorId, quantity } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        if (vendor.availableMilk < quantity) {
            return res.status(400).json({ error: `Not enough milk. Available: ${vendor.availableMilk} L` });
        }

        const rate = vendor.rate;
        const amount = quantity * rate;

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

        customer.walletBalance -= amount;
        await customer.save();

        vendor.availableMilk -= quantity;
        await vendor.save();

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/transactions
router.get('/transactions', authenticateToken, async (req, res) => {
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

// PUT /api/transactions/:id/verify
router.put('/transactions/:id/verify', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });
        if (req.user.id !== transaction.customerId) return res.status(403).json({ error: "Unauthorized" });

        const { status } = req.body;
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

// PUT /api/transactions/:id/delivery
router.put('/transactions/:id/delivery', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.status(403).json({ error: "Only vendors can updates delivery" });

        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });
        if (transaction.vendorId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

        const { status } = req.body;
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

// PUT /api/transactions/:id/pay
router.put('/transactions/:id/pay', authenticateToken, async (req, res) => {
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

        customer.walletBalance -= transaction.amount;
        await customer.save();

        transaction.status = 'completed';
        await transaction.save();

        res.json({ message: "Payment successful", balance: customer.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/balance
router.get('/balance', authenticateToken, async (req, res) => {
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

module.exports = router;
