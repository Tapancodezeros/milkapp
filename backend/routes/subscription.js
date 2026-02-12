const express = require('express');
const router = express.Router();
const { Subscription, Vendor, Customer, Transaction } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');

// POST /api/subscribe
router.post('/subscribe', authenticateToken, Validation.subscribe, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return res.status(403).json({ error: "Only customers can subscribe" });
        const { vendorId, quantity, duration } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

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

// GET /api/subscriptions
router.get('/subscriptions', authenticateToken, async (req, res) => {
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

// PUT /api/subscriptions/:id
router.put('/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const { status, quantity } = req.body;
        const sub = await Subscription.findByPk(req.params.id);

        if (!sub) return res.status(404).json({ error: "Subscription not found" });

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

// PUT /api/subscriptions/:id/toggle
router.put('/subscriptions/:id/toggle', authenticateToken, async (req, res) => {
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

// PUT /api/subscriptions/:id/cancel
router.put('/subscriptions/:id/cancel', authenticateToken, async (req, res) => {
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

module.exports = router;
