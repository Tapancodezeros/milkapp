const express = require('express');
const router = express.Router();
const VendorService = require('../services/VendorService');
const authenticateToken = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');
const handleRouteError = require('../utils/handleRouteError');

// GET /api/vendors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await VendorService.getAllVendors({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 3,
            search: req.query.search || '',
            availableOnly: req.query.availableOnly === 'true',
            minRate: req.query.minRate ? parseFloat(req.query.minRate) : undefined,
            maxRate: req.query.maxRate ? parseFloat(req.query.maxRate) : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        });
        return ApiResponse.success(res, "Vendors fetched", result);
    } catch (err) {
        return handleRouteError(res, err);
    }
});

module.exports = router;
