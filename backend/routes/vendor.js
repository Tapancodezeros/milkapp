const express = require('express');
const router = express.Router();
const VendorService = require('../services/VendorService');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');
const { UserRole } = require('../utils/constants');
const handleRouteError = require('../utils/handleRouteError');

// GET /api/vendor/me
router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const vendorData = await VendorService.getProfile(req.user.id);
        return ApiResponse.success(res, "Vendor data fetched", vendorData);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// PUT /api/vendor/update
router.put('/update', authenticateToken, Validation.vendorUpdate, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const result = await VendorService.updateVendor(req.user.id, req.body);
        return ApiResponse.success(res, "Vendor updated", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// POST /api/vendor/process-subscriptions
router.post('/process-subscriptions', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const result = await VendorService.processSubscriptions(req.user.id);
        return ApiResponse.success(res, `Processed ${result.processedCount} new orders. (Skipped ${result.skippedCount} already processed)`, { remainingMilk: result.remainingMilk });
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/vendor/inventory-history
router.get('/inventory-history', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const history = await VendorService.getInventoryHistory(req.user.id);
        return ApiResponse.success(res, "Inventory history fetched", history);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

// GET /api/vendor/reports
router.get('/reports', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const report = await VendorService.getReports(req.user.id);
        return ApiResponse.success(res, "Reports fetched", report);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.put('/profile', authenticateToken, Validation.updateProfile, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const result = await VendorService.updateProfile(req.user.id, req.body);
        return ApiResponse.success(res, "Profile updated successfully", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

router.put('/toggle-availability', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const result = await VendorService.toggleAvailability(req.user.id);
        return ApiResponse.success(res, `Availability set to ${result.isAvailable ? 'Active' : 'Holiday'}`, result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

const AuditLogService = require('../services/AuditLogService');

router.get('/activity-logs', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== UserRole.VENDOR) return ApiResponse.error(res, "Not a vendor", 403);
        const { page = 1, limit = 10 } = req.query;
        const logs = await AuditLogService.getAuditLogs({
            page,
            limit,
            userRole: UserRole.VENDOR,
            search: req.user.id.toString()
        });
        return ApiResponse.success(res, "Activity logs fetched successfully", logs);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
