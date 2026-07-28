const { Vendor, InventoryHistory, Subscription, Transaction, Customer } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');

class VendorService {
    async getProfile(id) {
        const vendor = await Vendor.findByPk(id, { attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] });
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

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
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

        if (rate !== undefined) {
            vendor.rate = rate;
        }

        if (addMilk !== undefined) {
            const milkToAdd = parseFloat(addMilk);
            const newTotal = (parseFloat(vendor.availableMilk) || 0) + milkToAdd;
            if (newTotal > 1000) {
                throw new AppError(`Cannot exceed total stock of 1000L. Current: ${vendor.availableMilk}L, Max possible add: ${1000 - vendor.availableMilk}L`);
            }

            vendor.availableMilk = newTotal;
            await InventoryHistory.create({ vendorId: id, amount: milkToAdd });
        }

        if (removeMilk !== undefined) {
            const milkToRemove = parseFloat(removeMilk);
            const currentStock = parseFloat(vendor.availableMilk) || 0;

            if (currentStock < milkToRemove) {
                throw new AppError(`Cannot remove ${milkToRemove}L. Current stock: ${currentStock}L`);
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
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

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

            let pausedList = [];
            try {
                pausedList = JSON.parse(sub.rainPausedDates || '[]');
            } catch (e) {
                pausedList = [];
            }
            if (pausedList.includes(today)) {
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
        const transactions = await Transaction.findAll({
            where: {
                vendorId,
                status: 'completed',
                deliveryStatus: { [Op.ne]: 'not_delivered' }
            }
        });
        const monthlyData = {};

        transactions.forEach(t => {
            const month = t.date.substring(0, 7);
            if (!monthlyData[month]) monthlyData[month] = { revenue: 0, volume: 0 };
            monthlyData[month].revenue += parseFloat(t.amount) || 0;
            monthlyData[month].volume += parseFloat(t.quantity) || 0;
        });

        return monthlyData;
    }

    async toggleAvailability(id) {
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

        vendor.isAvailable = !vendor.isAvailable;
        await vendor.save();
        return { isAvailable: vendor.isAvailable };
    }

    async getAllVendors(options = {}) {
        const {
            page = 1,
            limit = 3,
            search = '',
            availableOnly = false,
            minRate,
            maxRate,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = options;
        const offset = (page - 1) * limit;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (availableOnly) {
            where.isAvailable = true;
            where.availableMilk = { [Op.gt]: 0 };
        }

        if (minRate !== undefined || maxRate !== undefined) {
            where.rate = {};

            if (minRate !== undefined) {
                where.rate[Op.gte] = minRate;
            }

            if (maxRate !== undefined) {
                where.rate[Op.lte] = maxRate;
            }
        }

        const allowedSortFields = new Set(['createdAt', 'name', 'rate', 'availableMilk']);
        const safeSortBy = allowedSortFields.has(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows } = await Vendor.findAndCountAll({
            where,
            attributes: ['id', 'name', 'phone', 'email', 'rate', 'availableMilk', 'isAvailable'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[safeSortBy, safeSortOrder]]
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
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

        const duplicateChecks = [];
        if (name && name !== vendor.name) duplicateChecks.push({ name });
        if (phone && phone !== vendor.phone) duplicateChecks.push({ phone });

        if (duplicateChecks.length) {
            const existingVendor = await Vendor.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: duplicateChecks
                }
            });

            if (existingVendor) {
                if (existingVendor.phone === phone) {
                    throw new AppError("Phone number already registered", 409);
                }
                throw new AppError("Name already registered", 409);
            }
        }

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
