const express = require('express');
const router = express.Router();
const { Customer, Vendor, Transaction, Subscription } = require('../models');
const authenticateToken = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { UserRole } = require('../utils/constants');
const ApiResponse = require('../utils/apiResponse');
const { Op } = require('sequelize');

// Protect all admin routes
router.use(authenticateToken);
router.use(roleAuth([UserRole.ADMIN]));

// Dashboard Overview Stats
router.get('/overview', async (req, res) => {
    try {
        const { period } = req.query;
        let dateFilter = {};
        const today = new Date();

        if (period === 'this_month') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateFilter = { date: { [Op.gte]: startOfMonth } };
        } else if (period === 'last_month') {
            const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            dateFilter = { date: { [Op.gte]: startOfLastMonth, [Op.lte]: endOfLastMonth } };
        } else if (period === 'this_week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            dateFilter = { date: { [Op.gte]: startOfWeek } };
        }

        const totalCustomers = await Customer.count();
        const totalVendors = await Vendor.count();

        const revenueResult = await Transaction.sum('amount', {
            where: { status: 'completed', ...dateFilter }
        });
        const totalRevenue = revenueResult || 0;

        const activeSubscriptions = await Subscription.count({
            where: { status: 'active' }
        });

        const recentTransactions = await Transaction.findAll({
            where: { ...dateFilter },
            limit: 5,
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: Vendor, attributes: ['name', 'phone'] }
            ]
        });

        return ApiResponse.success(res, "Overview stats fetched successfully", {
            totalCustomers,
            totalVendors,
            totalRevenue,
            activeSubscriptions,
            recentTransactions
        });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// User Management
router.get('/customers', async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { phone: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }
        const customers = await Customer.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
        return ApiResponse.success(res, "Customers fetched successfully", customers);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

router.get('/vendors', async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { phone: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }
        const vendors = await Vendor.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
        return ApiResponse.success(res, "Vendors fetched successfully", vendors);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Transaction Management
router.get('/transactions', async (req, res) => {
    try {
        const { status, search } = req.query;
        const whereClause = {};

        if (status && status !== 'all') {
            whereClause.status = status;
        }

        if (search) {
            whereClause[Op.or] = [
                { '$Customer.name$': { [Op.iLike]: `%${search}%` } },
                { '$Vendor.name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: Vendor, attributes: ['name', 'phone'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return ApiResponse.success(res, "Transactions fetched successfully", transactions);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Subscription Management
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: Vendor, attributes: ['name', 'phone'] }
            ]
        });
        return ApiResponse.success(res, "Subscriptions fetched successfully", subscriptions);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Delete User (Customer or Vendor)
router.delete('/user/:role/:id', async (req, res) => {
    try {
        const { role, id } = req.params;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        await user.destroy();
        return ApiResponse.success(res, "User deleted successfully");
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Update User
router.put('/user/:role/:id', async (req, res) => {
    try {
        const { role, id } = req.params;
        const { name, email, phone, rate } = req.body;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        const updateData = { name, email, phone };
        if (role === UserRole.VENDOR && rate !== undefined) {
            updateData.rate = rate;
        }

        await user.update(updateData);
        return ApiResponse.success(res, "User updated successfully", user);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Trigger Password Reset
router.post('/user/:role/:id/reset-password', async (req, res) => {
    try {
        const { role, id } = req.params;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findByPk(id);
        if (!user) {
            return ApiResponse.error(res, "User not found", 404);
        }

        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&role=${role}`;

        console.log(`[ADMIN TRIGGERED] Password reset link for ${user.email}: ${resetLink}`);
        return ApiResponse.success(res, "Password reset link generated", { resetLink, token });
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

// Create New User (Customer or Vendor)
router.post('/user/create', async (req, res) => {
    try {
        const { name, email, phone, role, password, rate } = req.body;

        // Basic validation
        if (!name || !email || !role || !password) {
            return ApiResponse.error(res, "Name, Email, Role, and Password are required", 400);
        }

        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        // Check for existing user
        const existingUser = await Model.findOne({ where: { email } });
        if (existingUser) {
            return ApiResponse.error(res, "Email already registered", 400);
        }

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const createData = {
            name,
            email,
            phone,
            password: hashedPassword
        };

        if (role === UserRole.VENDOR) {
            createData.rate = rate || 60; // Default rate if not provided
        }

        const newUser = await Model.create(createData);

        // Remove password from response
        const userResponse = newUser.toJSON();
        delete userResponse.password;

        return ApiResponse.success(res, "User created successfully", userResponse);
    } catch (err) {
        return ApiResponse.error(res, err.message, 500);
    }
});

module.exports = router;
