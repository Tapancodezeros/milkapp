const express = require('express');
const router = express.Router();
const CustomerService = require('../services/CustomerService');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');
const { UserRole } = require('../utils/constants');
const handleRouteError = require('../utils/handleRouteError');

router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Not a customer", 403);
        const customer = await CustomerService.getProfile(req.user.id);
        return ApiResponse.success(res, "Profile fetched", customer);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.get('/insights', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Not a customer", 403);
        const insights = await CustomerService.getInsights(req.user.id);
        return ApiResponse.success(res, "Customer insights fetched", insights);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.post('/topup', authenticateToken, Validation.topup, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Not a customer", 403);
        const result = await CustomerService.topUp(req.user.id, req.body.amount);
        return ApiResponse.success(res, "Topup successful", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.put('/profile', authenticateToken, Validation.updateProfile, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Not a customer", 403);
        const result = await CustomerService.updateProfile(req.user.id, req.body);
        return ApiResponse.success(res, "Profile updated successfully", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.post('/withdraw', authenticateToken, Validation.withdraw, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) return ApiResponse.error(res, "Not a customer", 403);
        const result = await CustomerService.withdraw(req.user.id, req.body.amount);
        return ApiResponse.success(res, "Withdrawal successful", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
