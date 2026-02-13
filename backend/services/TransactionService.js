const { Transaction, Customer, Vendor } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');

class TransactionService {
    async buy(customerId, vendorId, quantity, type = 'purchase') {
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            throw new Error("Vendor not found");
        }

        if (!vendor.isAvailable) {
            throw new Error("Vendor is currently not available");
        }

        if (vendor.availableMilk < quantity) {
            throw new Error(`Not enough milk. Available: ${vendor.availableMilk} L`);
        }

        const rate = vendor.rate;
        const amount = quantity * rate;

        const customer = await Customer.findByPk(customerId);
        if (!customer || customer.walletBalance < amount) {
            throw new Error("Insufficient wallet balance. Please top up.");
        }

        const transaction = await Transaction.create({
            customerId,
            vendorId,
            quantity,
            amount,
            status: 'completed',
            type
        });

        customer.walletBalance -= amount;
        await customer.save();

        vendor.availableMilk -= quantity;
        await vendor.save();

        return transaction;
    }

    async getTransactions(userId, role, options = {}) {
        const { page = 1, limit = 10, paginate = false } = options;

        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };
        const include = role === UserRole.VENDOR
            ? [{ model: Customer, attributes: ['name', 'phone'] }]
            : [{ model: Vendor, attributes: ['name', 'phone'] }];

        if (paginate) {
            const offset = (page - 1) * limit;
            const { count, rows } = await Transaction.findAndCountAll({
                where,
                include,
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                data: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        }

        return await Transaction.findAll({
            where,
            include,
            order: [['createdAt', 'DESC']]
        });
    }

    async verifyDelivery(transactionId, status, userId) {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.customerId !== userId) {
            throw new Error("Unauthorized");
        }

        if (!['delivered', 'not_delivered'].includes(status)) {
            throw new Error("Invalid status. Use 'delivered' or 'not_delivered'.");
        }

        transaction.deliveryStatus = status;
        await transaction.save();

        return await Transaction.findByPk(transactionId, {
            include: [{ model: Vendor, attributes: ['name', 'phone'] }]
        });
    }

    async updateDelivery(transactionId, status, vendorId) {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.vendorId !== vendorId) {
            throw new Error("Unauthorized");
        }

        if (!['delivered', 'not_delivered'].includes(status)) {
            throw new Error("Invalid status. Use 'delivered' or 'not_delivered'.");
        }

        transaction.deliveryStatus = status;
        await transaction.save();
        return transaction;
    }

    async pay(transactionId, customerId) {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.customerId !== customerId) {
            throw new Error("Unauthorized");
        }
        if (transaction.status !== 'pending') {
            throw new Error("Transaction is not pending");
        }

        const customer = await Customer.findByPk(customerId);
        if (customer.walletBalance < transaction.amount) {
            throw new Error("Insufficient wallet balance. Please top up.");
        }

        customer.walletBalance -= transaction.amount;
        await customer.save();

        transaction.status = 'completed';
        await transaction.save();

        return { balance: customer.walletBalance };
    }

    async getBalance(userId, role) {
        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };
        const transactions = await Transaction.findAll({ where });

        let totalPaid = 0;
        let totalPending = 0;

        transactions.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.status === 'completed') {
                totalPaid += amt;
            } else if (t.status === 'pending') {
                totalPending += amt;
            }
        });

        return { totalPaid, totalPending };
    }

    async countTodayProcessed(vendorId) {
        const today = new Date().toISOString().split('T')[0];
        return await Transaction.count({
            where: {
                vendorId,
                date: today,
                status: 'pending'
            }
        });
    }

    async createSubscriptionTransaction(sub, vendor) {
        // Create transaction for subscription
        // This is a special method used by VendorService.processSubscriptions
        // Wait, VendorService logic is complex. It checks `Transaction` existence too.
        // Maybe I should keep logic in VendorService or expose helpers here.
        // Helper: check processed today.
        const today = new Date().toISOString().split('T')[0];
        const exists = await Transaction.findOne({
            where: {
                vendorId: vendor.id,
                customerId: sub.customerId,
                date: today,
                type: 'subscription'
            }
        });

        if (exists) return false;

        const amount = sub.quantity * sub.fixedRate;
        await Transaction.create({
            customerId: sub.customerId,
            vendorId: vendor.id,
            quantity: sub.quantity,
            amount,
            status: 'pending',
            type: 'subscription'
        });
        return true;
    }
}

module.exports = new TransactionService();
