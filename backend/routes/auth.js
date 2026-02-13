const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

router.post('/register', Validation.register, async (req, res) => {
    try {
        await AuthService.register(req.body);
        return ApiResponse.success(res, "Registration successful", null, 201);
    } catch (err) {
        return ApiResponse.error(res, err.message, 400);
    }
});

router.post('/login', Validation.login, async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        return ApiResponse.success(res, "Login successful", result);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500); // Or 401 based on error
    }
});

router.post('/forgot-password', Validation.forgotPassword, async (req, res) => {
    try {
        const result = await AuthService.forgotPassword(req.body);
        return ApiResponse.success(res, "Reset token generated", result);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.post('/reset-password', Validation.resetPassword, async (req, res) => {
    try {
        await AuthService.resetPassword(req.body);
        return ApiResponse.success(res, "Password reset successful");
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
