const { Customer, Transaction, Subscription, Vendor } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');

class CustomerService {
    async getProfile(id) {
        const customer = await Customer.findByPk(id, { attributes: ['id', 'name', 'email', 'phone', 'walletBalance'] });

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        return customer;
    }

    async getInsights(id) {
        const customer = await Customer.findByPk(id, {
            attributes: ['id', 'walletBalance']
        });

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .slice(0, 10);

        const [pendingTransactions, completedTransactions, activeSubscriptions, availableVendors] = await Promise.all([
            Transaction.findAll({
                where: { customerId: id, status: 'pending' },
                include: [{ model: Vendor, attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] }],
                order: [['date', 'ASC'], ['createdAt', 'ASC']]
            }),
            Transaction.findAll({
                where: { customerId: id, status: 'completed' },
                include: [{ model: Vendor, attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] }],
                order: [['date', 'DESC'], ['createdAt', 'DESC']]
            }),
            Subscription.findAll({
                where: { customerId: id, status: 'active' },
                include: [{ model: Vendor, attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'] }]
            }),
            Vendor.findAll({
                where: {
                    isAvailable: true,
                    availableMilk: { [Op.gt]: 0 }
                },
                attributes: ['id', 'name', 'rate', 'availableMilk', 'isAvailable'],
                order: [['rate', 'ASC'], ['availableMilk', 'DESC']]
            })
        ]);

        const pendingAmount = pendingTransactions.reduce((sum, transaction) => {
            return sum + (parseFloat(transaction.amount) || 0);
        }, 0);

        const monthlySpend = completedTransactions.reduce((sum, transaction) => {
            if (transaction.date >= startOfMonth) {
                return sum + (parseFloat(transaction.amount) || 0);
            }

            return sum;
        }, 0);

        const activeSubscriptionVolume = activeSubscriptions.reduce((sum, subscription) => {
            return sum + (parseFloat(subscription.quantity) || 0);
        }, 0);

        const vendorUsage = completedTransactions.reduce((map, transaction) => {
            const vendorId = transaction.vendorId;
            const current = map.get(vendorId) || {
                id: vendorId,
                name: transaction.Vendor?.name || 'Unknown Vendor',
                rate: parseFloat(transaction.Vendor?.rate) || 0,
                orderCount: 0,
                totalSpent: 0
            };

            current.orderCount += 1;
            current.totalSpent += parseFloat(transaction.amount) || 0;
            map.set(vendorId, current);
            return map;
        }, new Map());

        const favoriteVendor = [...vendorUsage.values()].sort((left, right) => {
            if (right.orderCount !== left.orderCount) {
                return right.orderCount - left.orderCount;
            }

            return right.totalSpent - left.totalSpent;
        })[0] || null;

        const subscribedVendorIds = new Set(activeSubscriptions.map((subscription) => subscription.vendorId));
        const unsubscribedRecommendations = availableVendors.filter((vendor) => !subscribedVendorIds.has(vendor.id));
        const recommendedVendor = (unsubscribedRecommendations[0] || availableVendors[0] || null);

        const walletBalance = parseFloat(customer.walletBalance) || 0;
        const lowBalanceThreshold = 150;
        const oldestPendingTransaction = pendingTransactions[0] || null;

        let nextAction = {
            type: 'browse',
            title: 'Browse today\'s vendor list',
            description: 'Explore current rates and stock before placing your next order.'
        };

        if (oldestPendingTransaction) {
            nextAction = {
                type: 'pay_pending',
                title: `Clear ₹${pendingAmount.toFixed(2)} in pending payments`,
                description: `${pendingTransactions.length} pending order${pendingTransactions.length > 1 ? 's are' : ' is'} waiting for wallet payment.`,
                transactionId: oldestPendingTransaction.id
            };
        } else if (walletBalance < lowBalanceThreshold) {
            nextAction = {
                type: 'topup',
                title: 'Top up your wallet',
                description: `Keep at least ₹${lowBalanceThreshold} ready so daily deliveries continue without interruption.`
            };
        } else if (!activeSubscriptions.length && recommendedVendor) {
            nextAction = {
                type: 'subscribe',
                title: `Start a plan with ${recommendedVendor.name}`,
                description: `Lowest live rate right now at ₹${recommendedVendor.rate}/L with ${recommendedVendor.availableMilk}L in stock.`,
                vendorId: recommendedVendor.id
            };
        }

        return {
            wallet: {
                balance: walletBalance,
                lowBalanceThreshold,
                isLowBalance: walletBalance < lowBalanceThreshold
            },
            pending: {
                count: pendingTransactions.length,
                amount: pendingAmount,
                oldestTransactionId: oldestPendingTransaction?.id || null
            },
            subscriptions: {
                activeCount: activeSubscriptions.length,
                dailyVolume: activeSubscriptionVolume
            },
            monthlySpend,
            favoriteVendor,
            recommendedVendor: recommendedVendor ? {
                id: recommendedVendor.id,
                name: recommendedVendor.name,
                rate: parseFloat(recommendedVendor.rate) || 0,
                availableMilk: parseFloat(recommendedVendor.availableMilk) || 0,
                isAvailable: recommendedVendor.isAvailable
            } : null,
            nextAction
        };
    }

    async topUp(id, amount) {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const newBalance = (parseFloat(customer.walletBalance) || 0) + parseFloat(amount);

        if (newBalance > 50000) {
            throw new AppError(`Wallet balance cannot exceed ₹50,000. Current: ₹${customer.walletBalance}, Max top-up allowed: ₹${50000 - customer.walletBalance}`);
        }

        customer.walletBalance = newBalance;
        await customer.save();
        return { balance: customer.walletBalance };
    }

    async withdraw(id, amount) {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const balance = parseFloat(customer.walletBalance) || 0;
        const withdrawAmount = parseFloat(amount);

        if (balance < withdrawAmount) {
            throw new AppError(`Insufficient funds. Current balance: ₹${balance}`, 400);
        }

        customer.walletBalance = balance - withdrawAmount;
        await customer.save();
        return { balance: customer.walletBalance };
    }

    async updateProfile(id, data) {
        const { name, phone, password } = data;
        const customer = await Customer.findByPk(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const duplicateChecks = [];
        if (name && name !== customer.name) duplicateChecks.push({ name });
        if (phone && phone !== customer.phone) duplicateChecks.push({ phone });

        if (duplicateChecks.length) {
            const existingCustomer = await Customer.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: duplicateChecks
                }
            });

            if (existingCustomer) {
                if (existingCustomer.phone === phone) {
                    throw new AppError("Phone number already registered", 409);
                }
                throw new AppError("Name already registered", 409);
            }
        }

        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (password) {
            customer.password = await bcrypt.hash(password, 10);
        }

        await customer.save();
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        };
    }
}

module.exports = new CustomerService();
