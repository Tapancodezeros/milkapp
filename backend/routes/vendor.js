const express = require('express');
const router = express.Router();
const { Vendor, Transaction, InventoryHistory, Subscription, Customer } = require('../models');
const authenticateToken = require('../middleware/auth');
const Validation = require('../validations/requestValidation');
const ApiResponse = require('../utils/apiResponse');

// GET /api/vendor/me
router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);
        const vendor = await Vendor.findByPk(req.user.id, { attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] });

        const today = new Date().toISOString().split('T')[0];
        const processedCount = await Transaction.count({
            where: {
                vendorId: req.user.id,
                date: today,
                status: 'pending'
            }
        });

        return ApiResponse.success(res, "Vendor data fetched", { ...vendor.toJSON(), todayProcessed: processedCount > 0 });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// PUT /api/vendor/update
router.put('/update', authenticateToken, Validation.vendorUpdate, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);
        const { rate, addMilk } = req.body;

        const vendor = await Vendor.findByPk(req.user.id);

        if (rate !== undefined) {
            vendor.rate = rate;
        }

        if (addMilk !== undefined) {
            const milkToAdd = parseFloat(addMilk);
            const newTotal = (parseFloat(vendor.availableMilk) || 0) + milkToAdd;
            if (newTotal > 1000) {
                return ApiResponse.error(res, `Cannot exceed total stock of 1000L. Current: ${vendor.availableMilk}L, Max possible add: ${1000 - vendor.availableMilk}L`, 400);
            }

            vendor.availableMilk = newTotal;
            await InventoryHistory.create({ vendorId: req.user.id, amount: milkToAdd });
        }

        await vendor.save();
        return ApiResponse.success(res, "Vendor updated", vendor);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// POST /api/vendor/process-subscriptions
router.post('/process-subscriptions', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.status(403).json({ error: "Not a vendor" });

        const today = new Date().toISOString().split('T')[0];
        const vendor = await Vendor.findByPk(req.user.id);
        const subs = await Subscription.findAll({ where: { vendorId: req.user.id, status: 'active' } });

        let processedCount = 0;
        let skippedCount = 0;

        for (const sub of subs) {
            if (sub.endDate && sub.endDate < today) {
                sub.status = 'cancelled';
                await sub.save();
                skippedCount++;
                continue;
            }

            const alreadyProcessed = await Transaction.findOne({
                where: {
                    vendorId: req.user.id,
                    customerId: sub.customerId,
                    date: today,
                    type: 'subscription'
                }
            });

            if (alreadyProcessed) {
                skippedCount++;
                continue;
            }

            if (vendor.availableMilk >= sub.quantity) {
                const amount = sub.quantity * sub.fixedRate;

                await Transaction.create({
                    customerId: sub.customerId,
                    vendorId: vendor.id,
                    quantity: sub.quantity,
                    amount,
                    status: 'pending',
                    type: 'subscription'
                });

                vendor.availableMilk -= sub.quantity;
                processedCount++;
            }
        }

        await vendor.save();
        return ApiResponse.success(res, `Processed ${processedCount} new orders. (Skipped ${skippedCount} already processed)`, { remainingMilk: vendor.availableMilk });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// GET /api/vendor/inventory-history
router.get('/inventory-history', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);
        const history = await InventoryHistory.findAll({
            where: { vendorId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        return ApiResponse.success(res, "Inventory history fetched", history);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// GET /api/vendor/reports
router.get('/reports', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);

        const transactions = await Transaction.findAll({ where: { vendorId: req.user.id } });
        const monthlyData = {};

        transactions.forEach(t => {
            const month = t.date.substring(0, 7);
            if (!monthlyData[month]) monthlyData[month] = { revenue: 0, volume: 0 };
            monthlyData[month].revenue += parseFloat(t.amount);
            monthlyData[month].volume += parseFloat(t.quantity);
        });

        return ApiResponse.success(res, "Reports fetched", monthlyData);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.put('/profile', authenticateToken, Validation.updateProfile, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);
        const { name, phone, password } = req.body;
        const vendor = await Vendor.findByPk(req.user.id);

        if (name) vendor.name = name;
        if (phone) vendor.phone = phone;
        if (password) {
            const bcrypt = require('bcryptjs');
            vendor.password = await bcrypt.hash(password, 10);
        }

        await vendor.save();
        return ApiResponse.success(res, "Profile updated successfully", {
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone
        });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.put('/toggle-availability', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return ApiResponse.error(res, "Not a vendor", 403);
        const vendor = await Vendor.findByPk(req.user.id);
        vendor.isAvailable = !vendor.isAvailable;
        await vendor.save();
        return ApiResponse.success(res, `Availability set to ${vendor.isAvailable ? 'Active' : 'Holiday'}`, { isAvailable: vendor.isAvailable });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
