const { Transaction, Customer, Vendor, sequelize } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');
const AppError = require('../utils/appError');

class TransactionService {
    async buy(customerId, vendorId, quantity, type = 'purchase') {
        const purchaseQuantity = parseFloat(quantity);

        return sequelize.transaction(async (dbTransaction) => {
            const vendor = await Vendor.findByPk(vendorId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!vendor) {
                throw new AppError("Vendor not found", 404);
            }

            if (!vendor.isAvailable) {
                throw new AppError("Vendor is currently not available", 409);
            }

            if (parseFloat(vendor.availableMilk) < purchaseQuantity) {
                throw new AppError(`Not enough milk. Available: ${vendor.availableMilk} L`);
            }

            const amount = purchaseQuantity * vendor.rate;

            const customer = await Customer.findByPk(customerId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!customer) {
                throw new AppError("Customer not found", 404);
            }

            if (parseFloat(customer.walletBalance) < amount) {
                throw new AppError("Insufficient wallet balance. Please top up.");
            }

            const transaction = await Transaction.create({
                customerId,
                vendorId,
                quantity: purchaseQuantity,
                amount,
                status: 'completed',
                type
            }, { transaction: dbTransaction });

            customer.walletBalance -= amount;
            await customer.save({ transaction: dbTransaction });

            vendor.availableMilk -= purchaseQuantity;
            await vendor.save({ transaction: dbTransaction });

            return transaction;
        });
    }

    async getTransactions(userId, role, options = {}) {
        const {
            page = 1,
            limit = 10,
            paginate = false,
            status,
            type,
            deliveryStatus,
            search,
            dateFrom,
            dateTo
        } = options;

        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };
        const include = role === UserRole.VENDOR
            ? [{ model: Customer, attributes: ['name', 'phone', 'email'] }]
            : [{ model: Vendor, attributes: ['name', 'phone', 'email'] }];

        if (status && status !== 'all') {
            where.status = status;
        }

        if (type && type !== 'all') {
            where.type = type;
        }

        if (deliveryStatus && deliveryStatus !== 'all') {
            where.deliveryStatus = deliveryStatus;
        }

        if (dateFrom || dateTo) {
            where.date = {};

            if (dateFrom) {
                where.date[Op.gte] = dateFrom;
            }

            if (dateTo) {
                where.date[Op.lte] = dateTo;
            }
        }

        if (search) {
            const searchScope = role === UserRole.VENDOR ? 'Customer' : 'Vendor';
            where[Op.or] = [
                { [`$${searchScope}.name$`]: { [Op.iLike]: `%${search}%` } },
                { [`$${searchScope}.phone$`]: { [Op.iLike]: `%${search}%` } },
                { [`$${searchScope}.email$`]: { [Op.iLike]: `%${search}%` } }
            ];
        }

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
            throw new AppError("Transaction not found", 404);
        }
        if (transaction.customerId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        if (!['delivered', 'not_delivered'].includes(status)) {
            throw new AppError("Invalid status. Use 'delivered' or 'not_delivered'.");
        }

        if (transaction.status !== 'completed') {
            throw new AppError("Complete payment before verifying delivery", 409);
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
            throw new AppError("Transaction not found", 404);
        }
        if (transaction.vendorId !== vendorId) {
            throw new AppError("Unauthorized", 403);
        }

        if (!['delivered', 'not_delivered'].includes(status)) {
            throw new AppError("Invalid status. Use 'delivered' or 'not_delivered'.");
        }

        transaction.deliveryStatus = status;
        await transaction.save();
        return transaction;
    }

    async pay(transactionId, customerId) {
        return sequelize.transaction(async (dbTransaction) => {
            const transaction = await Transaction.findByPk(transactionId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!transaction) {
                throw new AppError("Transaction not found", 404);
            }
            if (transaction.customerId !== customerId) {
                throw new AppError("Unauthorized", 403);
            }
            if (transaction.status !== 'pending') {
                throw new AppError("Transaction is not pending", 409);
            }

            const customer = await Customer.findByPk(customerId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!customer) {
                throw new AppError("Customer not found", 404);
            }

            if (parseFloat(customer.walletBalance) < parseFloat(transaction.amount)) {
                throw new AppError("Insufficient wallet balance. Please top up.");
            }

            customer.walletBalance -= transaction.amount;
            await customer.save({ transaction: dbTransaction });

            transaction.status = 'completed';
            await transaction.save({ transaction: dbTransaction });

            return { balance: customer.walletBalance };
        });
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
