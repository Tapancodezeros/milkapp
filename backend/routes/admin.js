const express = require('express');
const router = express.Router();
const { Customer, Vendor, Transaction, Subscription } = require('../models');
const authenticateToken = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { UserRole } = require('../utils/constants');
const ApiResponse = require('../utils/apiResponse');

// Protect all admin routes
router.use(authenticateToken);
router.use(roleAuth([UserRole.ADMIN]));

// User Management
router.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: { exclude: ['password'] }
        });
        return ApiResponse.success(res, "Customers fetched successfully", customers);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.get('/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            attributes: { exclude: ['password'] }
        });
        return ApiResponse.success(res, "Vendors fetched successfully", vendors);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Transaction Management
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: Vendor, attributes: ['name', 'phone'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return ApiResponse.success(res, "Transactions fetched successfully", transactions);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Subscription Management
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: Vendor, attributes: ['name', 'phone'] }
            ]
        });
        return ApiResponse.success(res, "Subscriptions fetched successfully", subscriptions);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Delete User (Customer or Vendor)
router.delete('/user/:role/:id', async (req, res) => {
    try {
        const { role, id } = req.params;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        await user.destroy();
        return ApiResponse.success(res, "User deleted successfully");
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});
// Update User
router.put('/user/:role/:id', async (req, res) => {
    try {
        const { role, id } = req.params;
        const { name, email, phone, rate } = req.body;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        const updateData = { name, email, phone };
        if (role === UserRole.VENDOR && rate !== undefined) {
            updateData.rate = rate;
        }

        await user.update(updateData);
        return ApiResponse.success(res, "User updated successfully", user);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Trigger Password Reset
router.post('/user/:role/:id/reset-password', async (req, res) => {
    try {
        const { role, id } = req.params;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&role=${role}`;

        console.log(`[ADMIN TRIGGERED] Password reset link for ${user.email}: ${resetLink}`);
        return ApiResponse.success(res, "Password reset link generated", { resetLink, token });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
