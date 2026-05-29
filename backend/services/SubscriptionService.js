const { Subscription, Vendor, Customer } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');
const AppError = require('../utils/appError');

class SubscriptionService {
    async subscribe(customerId, vendorId, quantity, duration) {
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }

        if (!vendor.isAvailable) {
            throw new AppError("Vendor is currently not available", 409);
        }

        const existingSub = await Subscription.findOne({
            where: {
                customerId,
                vendorId,
                status: { [Op.in]: ['active', 'paused'] }
            }
        });

        if (existingSub) {
            throw new AppError("You already have an active or paused subscription with this vendor.", 409);
        }

        const startDate = new Date();
        const endDate = new Date();

        if (duration === '7_days') endDate.setDate(startDate.getDate() + 7);
        else if (duration === '1_month') endDate.setMonth(startDate.getMonth() + 1);
        else if (duration === '3_months') endDate.setMonth(startDate.getMonth() + 3);

        const sub = await Subscription.create({
            customerId,
            vendorId,
            quantity,
            duration,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            fixedRate: vendor.rate
        });

        return sub;
    }

    async getSubscriptions(userId, role) {
        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };
        const include = role === UserRole.VENDOR
            ? [{ model: Customer, attributes: ['name', 'phone', 'email'] }]
            : [{ model: Vendor, attributes: ['name', 'rate'] }];

        return await Subscription.findAll({
            where,
            include,
            order: [['createdAt', 'DESC']]
        });
    }

    async updateSubscription(id, data, userId, role) {
        const { status, quantity } = data;
        const sub = await Subscription.findByPk(id);

        if (!sub) {
            throw new AppError("Subscription not found", 404);
        }

        if (role === UserRole.CUSTOMER && sub.customerId !== userId) {
            throw new AppError("Unauthorized", 403);
        }
        if (role === UserRole.VENDOR && sub.vendorId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        if (status) sub.status = status;
        if (quantity !== undefined) sub.quantity = quantity;
        await sub.save();
        return sub;
    }

    async toggleStatus(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new AppError("Subscription not found", 404);
        }
        if (sub.customerId !== userId) {
            throw new AppError("Unauthorized", 403);
        }
        if (sub.status === 'cancelled') {
            throw new AppError("Cancelled subscriptions cannot be reactivated", 409);
        }

        sub.status = sub.status === 'active' ? 'paused' : 'active';
        await sub.save();
        return sub;
    }

    async cancel(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new AppError("Subscription not found", 404);
        }
        if (sub.customerId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        sub.status = 'cancelled';
        await sub.save();
        return sub;
    }

    async delete(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new AppError("Subscription not found", 404);
        }
        if (sub.customerId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        await sub.destroy();
        return { message: "Subscription deleted" };
    }
}

module.exports = new SubscriptionService();
