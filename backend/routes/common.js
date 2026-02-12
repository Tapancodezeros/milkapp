const express = require('express');
const router = express.Router();
const { Vendor } = require('../models');
const authenticateToken = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');

// GET /api/vendors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const vendors = await Vendor.findAll({ attributes: ['id', 'name', 'phone', 'email', 'rate', 'availableMilk'] });
        return ApiResponse.success(res, "Vendors fetched", vendors);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
