const express = require('express');
const router = express.Router();
const SubscriptionService = require('../services/SubscriptionService');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');
const { UserRole } = require('../utils/constants');
const handleRouteError = require('../utils/handleRouteError');

// POST /api/subscribe
router.post('/subscribe', authenticateToken, Validation.subscribe, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Only customers can subscribe", 403);
        const { vendorId, quantity, duration, deliveryTime } = req.body;
        const sub = await SubscriptionService.subscribe(req.user.id, vendorId, quantity, duration, deliveryTime);
        return ApiResponse.success(res, "Subscribed successfully", sub, 201);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/subscriptions
router.get('/subscriptions', authenticateToken, async (req, res) => {
    try {
        const subs = await SubscriptionService.getSubscriptions(req.user.id, req.user.role);
        return ApiResponse.success(res, "Subscriptions fetched", subs);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/subscriptions/:id
router.put('/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const sub = await SubscriptionService.updateSubscription(req.params.id, req.body, req.user.id, req.user.role);
        return ApiResponse.success(res, "Subscription updated", sub);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/subscriptions/:id/toggle
router.put('/subscriptions/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const sub = await SubscriptionService.toggleStatus(req.params.id, req.user.id);
        return ApiResponse.success(res, `Subscription ${sub.status}`, sub);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/subscriptions/:id/cancel
router.put('/subscriptions/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const sub = await SubscriptionService.cancel(req.params.id, req.user.id);
        return ApiResponse.success(res, "Subscription cancelled", sub);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// DELETE /api/subscriptions/:id
router.delete('/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const sub = await SubscriptionService.delete(req.params.id, req.user.id);
        return ApiResponse.success(res, "Subscription deleted", sub);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
