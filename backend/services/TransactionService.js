const { Transaction, Customer, Vendor, sequelize } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');
const AppError = require('../utils/appError');

class TransactionService {
    async buy(customerId, vendorId, quantity, type = 'purchase') {
        const purchaseQuantity = parseFloat(quantity);
        if (isNaN(purchaseQuantity) || !Number.isFinite(purchaseQuantity) || purchaseQuantity <= 0) {
            throw new AppError("Invalid purchase quantity", 400);
        }

        return sequelize.transaction(async (dbTransaction) => {
            const vendor = await Vendor.findByPk(vendorId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!vendor) {
                throw new AppError("Vendor not found", 404);
            }

            if (!vendor.isAvailable) {
                throw new AppError("Vendor is currently not available for orders", 409);
            }

            const currentMilk = parseFloat(vendor.availableMilk) || 0;
            if (currentMilk < purchaseQuantity) {
                throw new AppError(`Insufficient vendor milk stock. Available: ${currentMilk} L`, 400);
            }

            const vendorRate = parseFloat(vendor.rate) || 0;
            if (vendorRate <= 0) {
                throw new AppError("Invalid vendor rate", 400);
            }

            const rawAmount = purchaseQuantity * vendorRate;
            const amount = Math.round(rawAmount * 100) / 100;

            const customer = await Customer.findByPk(customerId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!customer) {
                throw new AppError("Customer not found", 404);
            }

            const currentWallet = parseFloat(customer.walletBalance) || 0;
            if (currentWallet < amount) {
                throw new AppError(`Insufficient wallet balance. Required: ₹${amount.toFixed(2)}, Available: ₹${currentWallet.toFixed(2)}. Please top up your wallet.`, 400);
            }

            const transaction = await Transaction.create({
                customerId,
                vendorId,
                quantity: purchaseQuantity,
                amount,
                status: 'completed',
                type
            }, { transaction: dbTransaction });

            customer.walletBalance = Math.round((currentWallet - amount) * 100) / 100;
            await customer.save({ transaction: dbTransaction });

            vendor.availableMilk = Math.round((currentMilk - purchaseQuantity) * 100) / 100;
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
        if (!['delivered', 'not_delivered'].includes(status)) {
            throw new AppError("Invalid status. Use 'delivered' or 'not_delivered'.", 400);
        }

        return sequelize.transaction(async (dbTransaction) => {
            const transaction = await Transaction.findByPk(transactionId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!transaction) {
                throw new AppError("Transaction not found", 404);
            }
            if (transaction.customerId !== userId) {
                throw new AppError("Unauthorized", 403);
            }

            if (transaction.status !== 'completed') {
                throw new AppError("Complete payment before verifying delivery", 409);
            }

            const previousDeliveryStatus = transaction.deliveryStatus;

            // If status is changed to 'not_delivered', refund customer wallet & return vendor stock
            if (status === 'not_delivered' && previousDeliveryStatus !== 'not_delivered') {
                const customer = await Customer.findByPk(userId, {
                    transaction: dbTransaction,
                    lock: dbTransaction.LOCK.UPDATE
                });
                if (customer) {
                    const currentWallet = parseFloat(customer.walletBalance) || 0;
                    const refundAmount = parseFloat(transaction.amount) || 0;
                    customer.walletBalance = Math.round((currentWallet + refundAmount) * 100) / 100;
                    await customer.save({ transaction: dbTransaction });
                }

                const vendor = await Vendor.findByPk(transaction.vendorId, {
                    transaction: dbTransaction,
                    lock: dbTransaction.LOCK.UPDATE
                });
                if (vendor) {
                    const currentMilk = parseFloat(vendor.availableMilk) || 0;
                    const returnQty = parseFloat(transaction.quantity) || 0;
                    vendor.availableMilk = Math.round((currentMilk + returnQty) * 100) / 100;
                    await vendor.save({ transaction: dbTransaction });
                }
            } else if (previousDeliveryStatus === 'not_delivered' && status === 'delivered') {
                const customer = await Customer.findByPk(userId, {
                    transaction: dbTransaction,
                    lock: dbTransaction.LOCK.UPDATE
                });
                const chargeAmount = parseFloat(transaction.amount) || 0;
                const currentWallet = parseFloat(customer?.walletBalance) || 0;

                if (!customer || currentWallet < chargeAmount) {
                    throw new AppError(`Insufficient wallet balance. Required: ₹${chargeAmount.toFixed(2)}, Available: ₹${currentWallet.toFixed(2)}.`, 400);
                }

                customer.walletBalance = Math.round((currentWallet - chargeAmount) * 100) / 100;
                await customer.save({ transaction: dbTransaction });

                const vendor = await Vendor.findByPk(transaction.vendorId, {
                    transaction: dbTransaction,
                    lock: dbTransaction.LOCK.UPDATE
                });
                if (vendor) {
                    const currentMilk = parseFloat(vendor.availableMilk) || 0;
                    const qty = parseFloat(transaction.quantity) || 0;
                    vendor.availableMilk = Math.max(0, Math.round((currentMilk - qty) * 100) / 100);
                    await vendor.save({ transaction: dbTransaction });
                }
            }

            transaction.deliveryStatus = status;
            await transaction.save({ transaction: dbTransaction });

            return await Transaction.findByPk(transactionId, {
                transaction: dbTransaction,
                include: [{ model: Vendor, attributes: ['name', 'phone'] }]
            });
        });
    }

    async updateDelivery(transactionId, status, vendorId) {
        if (!['delivered', 'not_delivered', 'pending'].includes(status)) {
            throw new AppError("Invalid status. Use 'delivered', 'not_delivered', or 'pending'.", 400);
        }

        return sequelize.transaction(async (dbTransaction) => {
            const transaction = await Transaction.findByPk(transactionId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!transaction) {
                throw new AppError("Transaction not found", 404);
            }
            if (transaction.vendorId !== vendorId) {
                throw new AppError("Unauthorized", 403);
            }

            const previousDeliveryStatus = transaction.deliveryStatus;

            // If status is changed to 'not_delivered', refund customer wallet & return vendor stock
            if (status === 'not_delivered' && previousDeliveryStatus !== 'not_delivered') {
                if (transaction.status === 'completed') {
                    const customer = await Customer.findByPk(transaction.customerId, {
                        transaction: dbTransaction,
                        lock: dbTransaction.LOCK.UPDATE
                    });
                    if (customer) {
                        const currentWallet = parseFloat(customer.walletBalance) || 0;
                        const refundAmount = parseFloat(transaction.amount) || 0;
                        customer.walletBalance = Math.round((currentWallet + refundAmount) * 100) / 100;
                        await customer.save({ transaction: dbTransaction });
                    }

                    const vendor = await Vendor.findByPk(vendorId, {
                        transaction: dbTransaction,
                        lock: dbTransaction.LOCK.UPDATE
                    });
                    if (vendor) {
                        const currentMilk = parseFloat(vendor.availableMilk) || 0;
                        const returnQty = parseFloat(transaction.quantity) || 0;
                        vendor.availableMilk = Math.round((currentMilk + returnQty) * 100) / 100;
                        await vendor.save({ transaction: dbTransaction });
                    }
                }
            } else if (previousDeliveryStatus === 'not_delivered' && (status === 'delivered' || status === 'pending')) {
                if (transaction.status === 'completed') {
                    const customer = await Customer.findByPk(transaction.customerId, {
                        transaction: dbTransaction,
                        lock: dbTransaction.LOCK.UPDATE
                    });
                    const chargeAmount = parseFloat(transaction.amount) || 0;
                    const currentWallet = parseFloat(customer?.walletBalance) || 0;

                    if (!customer || currentWallet < chargeAmount) {
                        throw new AppError(`Customer has insufficient wallet balance (₹${currentWallet.toFixed(2)}) to pay ₹${chargeAmount.toFixed(2)} for delivery.`, 400);
                    }

                    customer.walletBalance = Math.round((currentWallet - chargeAmount) * 100) / 100;
                    await customer.save({ transaction: dbTransaction });

                    const vendor = await Vendor.findByPk(vendorId, {
                        transaction: dbTransaction,
                        lock: dbTransaction.LOCK.UPDATE
                    });
                    if (vendor) {
                        const currentMilk = parseFloat(vendor.availableMilk) || 0;
                        const qty = parseFloat(transaction.quantity) || 0;
                        vendor.availableMilk = Math.max(0, Math.round((currentMilk - qty) * 100) / 100);
                        await vendor.save({ transaction: dbTransaction });
                    }
                }
            }

            transaction.deliveryStatus = status;
            await transaction.save({ transaction: dbTransaction });
            return transaction;
        });
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
                throw new AppError("Unauthorized access to transaction", 403);
            }
            if (transaction.status !== 'pending') {
                throw new AppError(`Transaction #${transactionId} is already ${transaction.status}`, 409);
            }

            const amountToPay = Math.round((parseFloat(transaction.amount) || 0) * 100) / 100;
            if (amountToPay <= 0) {
                throw new AppError("Invalid transaction amount", 400);
            }

            const customer = await Customer.findByPk(customerId, {
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (!customer) {
                throw new AppError("Customer not found", 404);
            }

            const currentBalance = parseFloat(customer.walletBalance) || 0;
            if (currentBalance < amountToPay) {
                throw new AppError(`Insufficient wallet balance. Required: ₹${amountToPay.toFixed(2)}, Available: ₹${currentBalance.toFixed(2)}. Please top up your wallet.`, 400);
            }

            customer.walletBalance = Math.round((currentBalance - amountToPay) * 100) / 100;
            await customer.save({ transaction: dbTransaction });

            transaction.status = 'completed';
            await transaction.save({ transaction: dbTransaction });

            return {
                transactionId: transaction.id,
                amountPaid: amountToPay,
                balance: customer.walletBalance
            };
        });
    }

    async getBalance(userId, role) {
        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };
        const transactions = await Transaction.findAll({ where });

        let totalPaid = 0;
        let totalPending = 0;

        transactions.forEach(t => {
            if (t.deliveryStatus === 'not_delivered') return;
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
