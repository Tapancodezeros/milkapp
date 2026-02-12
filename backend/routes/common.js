const express = require('express');
const router = express.Router();
const { Vendor } = require('../models');
const authenticateToken = require('../middleware/auth');

// GET /api/vendors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const vendors = await Vendor.findAll({ attributes: ['id', 'name', 'phone', 'email', 'rate', 'availableMilk'] });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
