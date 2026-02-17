const express = require('express');
const router = express.Router();
const VendorService = require('../services/VendorService');
const authenticateToken = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');

// GET /api/vendors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const search = req.query.search || '';
        const result = await VendorService.getAllVendors(page, limit, search);
        return ApiResponse.success(res, "Vendors fetched", result);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
