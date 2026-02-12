const express = require('express');
const router = express.Router();
const { Subscription, Vendor, Customer, Transaction } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

// POST /api/subscribe
router.post('/subscribe', authenticateToken, Validation.subscribe, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Only customers can subscribe", 403);
        const { vendorId, quantity, duration } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) return ApiResponse.error(res, "Vendor not found", 404);

        const existingSub = await Subscription.findOne({
            where: {
                customerId: req.user.id,
                vendorId,
                status: ['active', 'paused']
            }
        });

        if (existingSub) {
            return ApiResponse.error(res, "You already have an active or paused subscription with this vendor.", 400);
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
        return ApiResponse.success(res, "Subscribed successfully", sub, 201);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
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
        return ApiResponse.success(res, "Subscriptions fetched", subs);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/subscriptions/:id
router.put('/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const { status, quantity } = req.body;
        const sub = await Subscription.findByPk(req.params.id);

        if (!sub) return ApiResponse.error(res, "Subscription not found", 404);

        if (req.user.role === 'customer' && sub.customerId !== req.user.id) {
            return ApiResponse.error(res, "Unauthorized", 403);
        }
        if (req.user.role === 'vendor' && sub.vendorId !== req.user.id) {
            return ApiResponse.error(res, "Unauthorized", 403);
        }

        if (status) sub.status = status;
        if (quantity !== undefined) sub.quantity = quantity;
        await sub.save();
        return ApiResponse.success(res, "Subscription updated", sub);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/subscriptions/:id/toggle
router.put('/subscriptions/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const sub = await Subscription.findByPk(req.params.id);
        if (!sub) return ApiResponse.error(res, "Subscription not found", 404);
        if (sub.customerId !== req.user.id) return ApiResponse.error(res, "Unauthorized", 403);

        sub.status = sub.status === 'active' ? 'paused' : 'active';
        await sub.save();
        return ApiResponse.success(res, `Subscription ${sub.status}`, sub);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/subscriptions/:id/cancel
router.put('/subscriptions/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const sub = await Subscription.findByPk(req.params.id);
        if (!sub) return ApiResponse.error(res, "Subscription not found", 404);
        if (sub.customerId !== req.user.id) return ApiResponse.error(res, "Unauthorized", 403);

        sub.status = 'cancelled';
        await sub.save();
        return ApiResponse.success(res, "Subscription cancelled", sub);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
