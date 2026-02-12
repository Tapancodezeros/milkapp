const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer, Vendor } = require('../models');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

router.post('/register', Validation.register, async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const Model = role === 'vendor' ? Vendor : Customer;

        await Model.create({ name, phone, email, password: hashedPassword });
        return ApiResponse.success(res, "Registration successful", null, 201);
    } catch (err) {
        return ApiResponse.error(res, err.message, 400);
    }
});

router.post('/login', Validation.login, async (req, res) => {
    try {
        const { identifier, password, role } = req.body;
        const Model = role === 'vendor' ? Vendor : Customer;
        const { Op } = require('sequelize');

        const user = await Model.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { name: identifier }
                ]
            }
        });

        if (!user) return ApiResponse.error(res, "User not found", 404);

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return ApiResponse.error(res, "Invalid password", 400);

        const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: '1h' });
        return ApiResponse.success(res, "Login successful", { token, user: { id: user.id, name: user.name, role } });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.post('/forgot-password', Validation.forgotPassword, async (req, res) => {
    try {
        const { email, role } = req.body;
        const Model = role === 'vendor' ? Vendor : Customer;

        const user = await Model.findOne({ where: { email } });
        if (!user) return ApiResponse.error(res, "User with this email not found", 404);

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // In a real app, send email here. For now, return in response for dev.
        console.log(`Password reset token for ${email}: ${token}`);
        return ApiResponse.success(res, "Reset token generated", { token });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.post('/reset-password', Validation.resetPassword, async (req, res) => {
    try {
        const { token, newPassword, role } = req.body;
        const Model = role === 'vendor' ? Vendor : Customer;
        const { Op } = require('sequelize');

        const user = await Model.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: { [Op.gt]: Date.now() }
            }
        });

        if (!user) return ApiResponse.error(res, "Invalid or expired reset token", 400);

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return ApiResponse.success(res, "Password reset successful");
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
