const express = require('express');
const router = express.Router();
const VendorService = require('../services/VendorService');
const authenticateToken = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');

// GET /api/vendors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const vendors = await VendorService.getAllVendors();
        return ApiResponse.success(res, "Vendors fetched", vendors);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
