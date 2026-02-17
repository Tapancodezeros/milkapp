const { Vendor, InventoryHistory, Subscription, Transaction, Customer } = require('../models');
const { Op } = require('sequelize');
const runTransaction = require('../models').sequelize.transaction;
// Assuming sequelize instance is exported as .sequelize from models/index.js?
// models/index.js exports { sequelize, Customer, ... } so require('../models').sequelize works.

class VendorService {
    async getProfile(id) {
        const vendor = await Vendor.findByPk(id, { attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] });

        // We need 'todayProcessed' count. 
        // We can query Transaction model here or call TransactionService.
        // For simplicity and performance, querying here is fine as it's a dashboard view.
        const today = new Date().toISOString().split('T')[0];
        const processedCount = await Transaction.count({
            where: {
                vendorId: id,
                date: today,
                status: 'pending'
            }
        });

        return { ...vendor.toJSON(), todayProcessed: processedCount > 0 };
    }

    async updateVendor(id, data) {
        const { rate, addMilk, removeMilk } = data;
        const vendor = await Vendor.findByPk(id);

        if (rate !== undefined) {
            vendor.rate = rate;
        }

        if (addMilk !== undefined) {
            const milkToAdd = parseFloat(addMilk);
            const newTotal = (parseFloat(vendor.availableMilk) || 0) + milkToAdd;
            if (newTotal > 1000) {
                throw new Error(`Cannot exceed total stock of 1000L. Current: ${vendor.availableMilk}L, Max possible add: ${1000 - vendor.availableMilk}L`);
            }

            vendor.availableMilk = newTotal;
            await InventoryHistory.create({ vendorId: id, amount: milkToAdd });
        }

        if (removeMilk !== undefined) {
            const milkToRemove = parseFloat(removeMilk);
            const currentStock = parseFloat(vendor.availableMilk) || 0;

            if (currentStock < milkToRemove) {
                throw new Error(`Cannot remove ${milkToRemove}L. Current stock: ${currentStock}L`);
            }

            vendor.availableMilk = currentStock - milkToRemove;
            // Log as negative amount
            await InventoryHistory.create({ vendorId: id, amount: -milkToRemove });
        }

        await vendor.save();
        return vendor;
    }

    async processSubscriptions(vendorId) {
        const today = new Date().toISOString().split('T')[0];
        const vendor = await Vendor.findByPk(vendorId);
        const subs = await Subscription.findAll({ where: { vendorId, status: 'active' } });

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
                    vendorId,
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
        return { processedCount, skippedCount, remainingMilk: vendor.availableMilk };
    }

    async getInventoryHistory(vendorId) {
        return await InventoryHistory.findAll({
            where: { vendorId },
            order: [['createdAt', 'DESC']],
            limit: 10
        });
    }

    async getReports(vendorId) {
        const transactions = await Transaction.findAll({ where: { vendorId } });
        const monthlyData = {};

        transactions.forEach(t => {
            const month = t.date.substring(0, 7);
            if (!monthlyData[month]) monthlyData[month] = { revenue: 0, volume: 0 };
            monthlyData[month].revenue += parseFloat(t.amount);
            monthlyData[month].volume += parseFloat(t.quantity);
        });

        return monthlyData;
    }

    async toggleAvailability(id) {
        const vendor = await Vendor.findByPk(id);
        vendor.isAvailable = !vendor.isAvailable;
        await vendor.save();
        return { isAvailable: vendor.isAvailable };
    }

    async getAllVendors(page = 1, limit = 3, search = '') {
        const offset = (page - 1) * limit;
        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Vendor.findAndCountAll({
            where,
            attributes: ['id', 'name', 'phone', 'email', 'rate', 'availableMilk', 'isAvailable'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            vendors: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        };
    }

    async updateProfile(id, data) {
        const { name, phone, password } = data;
        const vendor = await Vendor.findByPk(id);

        if (name) vendor.name = name;
        if (phone) vendor.phone = phone;
        if (password) {
            const bcrypt = require('bcryptjs');
            vendor.password = await bcrypt.hash(password, 10);
        }

        await vendor.save();
        return {
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone
        };
    }
}

module.exports = new VendorService();
