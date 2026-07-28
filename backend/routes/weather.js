const express = require('express');
const router = express.Router();
const WeatherService = require('../services/WeatherService');
const authenticateToken = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');
const handleRouteError = require('../utils/handleRouteError');
const { UserRole } = require('../utils/constants');

// GET /api/weather/advisory
router.get('/advisory', async (req, res) => {
    try {
        const vendorId = req.query.vendorId ? parseInt(req.query.vendorId) : null;
        const advisory = await WeatherService.getAdvisory(vendorId);
        return ApiResponse.success(res, "Weather advisory fetched", advisory);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// POST /api/weather/toggle (Vendor or Admin)
router.post('/toggle', authenticateToken, async (req, res) => {
    try {
        if (![UserRole.VENDOR, UserRole.ADMIN].includes(req.user.role)) {
            return ApiResponse.error(res, "Unauthorized", 403);
        }

        const vendorId = req.user.role === UserRole.VENDOR ? req.user.id : (req.body.vendorId || null);
        const advisory = await WeatherService.toggleRainMode({
            isRainyMode: req.body.isRainyMode,
            severity: req.body.severity,
            advisoryTitle: req.body.advisoryTitle,
            advisoryMessage: req.body.advisoryMessage,
            estimatedDelayMinutes: req.body.estimatedDelayMinutes,
            vendorId
        });

        return ApiResponse.success(res, "Rainy weather mode updated successfully", advisory);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/weather/customer-preferences (Customer)
router.put('/customer-preferences', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) {
            return ApiResponse.error(res, "Not a customer", 403);
        }

        const result = await WeatherService.updateCustomerPreferences(req.user.id, {
            rainproofPackaging: req.body.rainproofPackaging,
            rainDropoffInstructions: req.body.rainDropoffInstructions
        });

        return ApiResponse.success(res, "Rain delivery preferences updated", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// POST /api/weather/skip-today (Customer)
router.post('/skip-today', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.CUSTOMER) {
            return ApiResponse.error(res, "Not a customer", 403);
        }

        const { subscriptionId } = req.body;
        if (!subscriptionId) {
            return ApiResponse.error(res, "Subscription ID is required", 400);
        }

        const result = await WeatherService.skipTodayRain(req.user.id, subscriptionId);
        return ApiResponse.success(res, "Today's delivery skipped due to rain", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/weather/vendor-summary (Vendor)
router.get('/vendor-summary', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) {
            return ApiResponse.error(res, "Not a vendor", 403);
        }

        const summary = await WeatherService.getVendorRainSummary(req.user.id);
        return ApiResponse.success(res, "Vendor rain summary fetched", summary);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
