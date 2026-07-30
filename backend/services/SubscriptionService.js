const { Subscription, Vendor, Customer } = require('../models');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');
const AppError = require('../utils/appError');
const AuditLogService = require('./AuditLogService');

class SubscriptionService {
    async subscribe(customerId, vendorId, quantity, duration, deliveryTime = '07:00 AM') {
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
            deliveryTime: deliveryTime || '07:00 AM',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            fixedRate: vendor.rate
        });

        AuditLogService.logAction({
            userId: customerId,
            userRole: UserRole.CUSTOMER,
            action: 'SUBSCRIPTION_CREATE',
            entity: 'Subscription',
            entityId: sub.id,
            details: { vendorId, quantity, duration, deliveryTime }
        });

        return sub;
    }

    async getSubscriptions(userId, role) {
        const where = role === UserRole.VENDOR ? { vendorId: userId } : { customerId: userId };

        if (role === UserRole.VENDOR) {
            return await Subscription.findAll({
                where,
                include: [{ model: Customer, attributes: ['name', 'phone', 'email'] }],
                order: [['createdAt', 'DESC']]
            });
        }

        const subscriptions = await Subscription.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        if (subscriptions.length > 0) {
            const vendorIds = [...new Set(subscriptions.map(s => s.vendorId))];
            const vendors = await Vendor.findAll({
                where: { id: vendorIds },
                attributes: ['id', 'name', 'rate']
            });
            const vMap = new Map(vendors.map(v => [v.id, v.toJSON ? v.toJSON() : v]));
            subscriptions.forEach(s => {
                const v = vMap.get(s.vendorId);
                if (v) s.setDataValue ? s.setDataValue('Vendor', v) : (s.Vendor = v);
            });
        }

        return subscriptions;
    }


    async updateSubscription(id, data, userId, role) {
        const { status, quantity, deliveryTime } = data;
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
        if (deliveryTime !== undefined) sub.deliveryTime = deliveryTime;
        await sub.save();

        AuditLogService.logAction({
            userId,
            userRole: role,
            action: 'SUBSCRIPTION_UPDATE',
            entity: 'Subscription',
            entityId: sub.id,
            details: { updatedFields: { status, quantity, deliveryTime } }
        });

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

        const oldStatus = sub.status;
        sub.status = sub.status === 'active' ? 'paused' : 'active';
        await sub.save();

        AuditLogService.logAction({
            userId,
            userRole: UserRole.CUSTOMER,
            action: 'SUBSCRIPTION_STATUS_TOGGLE',
            entity: 'Subscription',
            entityId: sub.id,
            details: { fromStatus: oldStatus, toStatus: sub.status }
        });

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

        AuditLogService.logAction({
            userId,
            userRole: UserRole.CUSTOMER,
            action: 'SUBSCRIPTION_CANCEL',
            entity: 'Subscription',
            entityId: sub.id,
            details: { status: 'cancelled' }
        });

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

        AuditLogService.logAction({
            userId,
            userRole: UserRole.CUSTOMER,
            action: 'SUBSCRIPTION_DELETE',
            entity: 'Subscription',
            entityId: id,
            details: { deleted: true }
        });

        return { message: "Subscription deleted" };
    }
}

module.exports = new SubscriptionService();
