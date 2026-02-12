const express = require('express');
const router = express.Router();
const { Transaction, Customer, Vendor } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

// POST /api/buy
router.post('/buy', authenticateToken, Validation.buy, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Only customers can buy milk", 403);
        const { vendorId, quantity } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) return ApiResponse.error(res, "Vendor not found", 404);

        if (vendor.availableMilk < quantity) {
            return ApiResponse.error(res, `Not enough milk. Available: ${vendor.availableMilk} L`, 400);
        }

        const rate = vendor.rate;
        const amount = quantity * rate;

        const customer = await Customer.findByPk(req.user.id);
        if (!customer || customer.walletBalance < amount) {
            return ApiResponse.error(res, "Insufficient wallet balance. Please top up.", 400);
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

        return ApiResponse.success(res, "Purchase successful", transaction, 201);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
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

            return ApiResponse.success(res, "Paginated transactions fetched", {
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

        return ApiResponse.success(res, "Transactions fetched", transactions);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/transactions/:id/verify
router.put('/transactions/:id/verify', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return ApiResponse.error(res, "Transaction not found", 404);
        if (req.user.id !== transaction.customerId) return ApiResponse.error(res, "Unauthorized", 403);

        const { status } = req.body;
        if (!['delivered', 'not_delivered'].includes(status)) {
            return ApiResponse.error(res, "Invalid status. Use 'delivered' or 'not_delivered'.", 400);
        }

        transaction.deliveryStatus = status;
        await transaction.save();

        const updatedTransaction = await Transaction.findByPk(req.params.id, {
            include: [{ model: Vendor, attributes: ['name', 'phone'] }]
        });
        return ApiResponse.success(res, "Delivery status verified", updatedTransaction);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/transactions/:id/delivery
router.put('/transactions/:id/delivery', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Only vendors can update delivery", 403);

        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return ApiResponse.error(res, "Transaction not found", 404);
        if (transaction.vendorId !== req.user.id) return ApiResponse.error(res, "Unauthorized", 403);

        const { status } = req.body;
        if (!['delivered', 'not_delivered'].includes(status)) {
            return ApiResponse.error(res, "Invalid status. Use 'delivered' or 'not_delivered'.", 400);
        }

        transaction.deliveryStatus = status;
        await transaction.save();
        return ApiResponse.success(res, "Delivery status updated", transaction);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/transactions/:id/pay
router.put('/transactions/:id/pay', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Only customers can pay", 403);

        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return ApiResponse.error(res, "Transaction not found", 404);
        if (transaction.customerId !== req.user.id) return ApiResponse.error(res, "Unauthorized", 403);
        if (transaction.status !== 'pending') return ApiResponse.error(res, "Transaction is not pending", 400);

        const customer = await Customer.findByPk(req.user.id);
        if (customer.walletBalance < transaction.amount) {
            return ApiResponse.error(res, "Insufficient wallet balance. Please top up.", 400);
        }

        customer.walletBalance -= transaction.amount;
        await customer.save();

        transaction.status = 'completed';
        await transaction.save();

        return ApiResponse.success(res, "Payment successful", { balance: customer.walletBalance });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
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

        return ApiResponse.success(res, "Balance fetched", { totalPaid, totalPending });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
