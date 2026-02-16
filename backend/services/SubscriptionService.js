const { Subscription, Vendor, Customer } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');

class SubscriptionService {
    async subscribe(customerId, vendorId, quantity, duration) {
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            throw new Error("Vendor not found");
        }

        const existingSub = await Subscription.findOne({
            where: {
                customerId,
                vendorId,
                status: ['active', 'paused']
            }
        });

        if (existingSub) {
            throw new Error("You already have an active or paused subscription with this vendor.");
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

        return await Subscription.findAll({ where, include });
    }

    async updateSubscription(id, data, userId, role) {
        const { status, quantity } = data;
        const sub = await Subscription.findByPk(id);

        if (!sub) {
            throw new Error("Subscription not found");
        }

        if (role === UserRole.CUSTOMER && sub.customerId !== userId) {
            throw new Error("Unauthorized");
        }
        if (role === UserRole.VENDOR && sub.vendorId !== userId) {
            throw new Error("Unauthorized");
        }

        if (status) sub.status = status;
        if (quantity !== undefined) sub.quantity = quantity;
        await sub.save();
        return sub;
    }

    async toggleStatus(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new Error("Subscription not found");
        }
        if (sub.customerId !== userId) {
            throw new Error("Unauthorized");
        }

        sub.status = sub.status === 'active' ? 'paused' : 'active';
        await sub.save();
        return sub;
    }

    async cancel(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new Error("Subscription not found");
        }
        if (sub.customerId !== userId) {
            throw new Error("Unauthorized");
        }

        sub.status = 'cancelled';
        await sub.save();
        return sub;
    }

    async delete(id, userId) {
        const sub = await Subscription.findByPk(id);
        if (!sub) {
            throw new Error("Subscription not found");
        }
        if (sub.customerId !== userId) {
            throw new Error("Unauthorized");
        }

        await sub.destroy();
        return { message: "Subscription deleted" };
    }
}

module.exports = new SubscriptionService();
