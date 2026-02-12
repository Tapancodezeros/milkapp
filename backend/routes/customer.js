const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Not a customer", 403);
        const customer = await Customer.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'phone', 'walletBalance'] });
        return ApiResponse.success(res, "Profile fetched", customer);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.post('/topup', authenticateToken, Validation.topup, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Not a customer", 403);
        const { amount } = req.body;

        const customer = await Customer.findByPk(req.user.id);
        const newBalance = (parseFloat(customer.walletBalance) || 0) + parseFloat(amount);

        if (newBalance > 50000) {
            return ApiResponse.error(res, `Wallet balance cannot exceed ₹50,000. Current: ₹${customer.walletBalance}, Max top-up allowed: ₹${50000 - customer.walletBalance}`, 400);
        }

        customer.walletBalance = newBalance;
        await customer.save();
        return ApiResponse.success(res, "Topup successful", { balance: customer.walletBalance });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.put('/profile', authenticateToken, Validation.updateProfile, async (req, res) => {
    try {
        if (req.user.role !== 'customer') return ApiResponse.error(res, "Not a customer", 403);
        const { name, phone, password } = req.body;
        const customer = await Customer.findByPk(req.user.id);

        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (password) {
            const bcrypt = require('bcryptjs');
            customer.password = await bcrypt.hash(password, 10);
        }

        await customer.save();
        return ApiResponse.success(res, "Profile updated successfully", {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
