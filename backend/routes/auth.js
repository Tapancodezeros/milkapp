const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');
const handleRouteError = require('../utils/handleRouteError');

router.post('/register', Validation.register, async (req, res) => {
    try {
        await AuthService.register(req.body);
        return ApiResponse.success(res, "Registration successful", null, 201);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.post('/login', Validation.login, async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        return ApiResponse.success(res, "Login successful", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.post('/forgot-password', Validation.forgotPassword, async (req, res) => {
    try {
        const result = await AuthService.forgotPassword(req.body);
        return ApiResponse.success(res, "Reset token generated", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.post('/reset-password', Validation.resetPassword, async (req, res) => {
    try {
        await AuthService.resetPassword(req.body);
        return ApiResponse.success(res, "Password reset successful");
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
