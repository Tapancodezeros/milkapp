const express = require('express');
const router = express.Router();
const TransactionService = require('../services/TransactionService');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');
const { UserRole } = require('../utils/constants');
const handleRouteError = require('../utils/handleRouteError');

// POST /api/buy
router.post('/buy', authenticateToken, Validation.buy, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Only customers can buy milk", 403);
        const { vendorId, quantity } = req.body;
        const transaction = await TransactionService.buy(req.user.id, vendorId, quantity);
        return ApiResponse.success(res, "Purchase successful", transaction, 201);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/transactions
router.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            paginate = 'false',
            status,
            type,
            deliveryStatus,
            search,
            dateFrom,
            dateTo
        } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            paginate: paginate === 'true',
            status,
            type,
            deliveryStatus,
            search,
            dateFrom,
            dateTo
        };

        const transactions = await TransactionService.getTransactions(req.user.id, req.user.role, options);

        if (options.paginate) {
            return ApiResponse.success(res, "Paginated transactions fetched", transactions);
        }

        return ApiResponse.success(res, "Transactions fetched", transactions);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/transactions/:id/verify
router.put('/transactions/:id/verify', authenticateToken, async (req, res) => {
    try {
        const transaction = await TransactionService.verifyDelivery(req.params.id, req.body.status, req.user.id);
        return ApiResponse.success(res, "Delivery status verified", transaction);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/transactions/:id/delivery
router.put('/transactions/:id/delivery', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Only vendors can update delivery", 403);
        const transaction = await TransactionService.updateDelivery(req.params.id, req.body.status, req.user.id);
        return ApiResponse.success(res, "Delivery status updated", transaction);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/transactions/:id/pay
router.put('/transactions/:id/pay', authenticateToken, Validation.payTransaction, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Only customers can pay", 403);
        const result = await TransactionService.pay(req.params.id, req.user.id);
        return ApiResponse.success(res, "Payment successful", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/balance
router.get('/balance', authenticateToken, async (req, res) => {
    try {
        const balance = await TransactionService.getBalance(req.user.id, req.user.role);
        return ApiResponse.success(res, "Balance fetched", balance);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
