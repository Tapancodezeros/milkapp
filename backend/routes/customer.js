const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');

router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return res.status(403).json({ error: "Not a customer" });
        const customer = await Customer.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'phone', 'walletBalance'] });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/topup', authenticateToken, Validation.topup, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return res.status(403).json({ error: "Not a customer" });
        const { amount } = req.body;

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

module.exports = router;
