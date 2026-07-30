const { AuditLog } = require('../models');
const { Op } = require('sequelize');

class AuditLogService {
    /**
     * Safely write an audit log entry to the audit database.
     * Non-blocking for the calling domain operation.
     */
    async logAction(logData) {
        try {
            const {
                userId = null,
                userRole = null,
                userEmail = null,
                action,
                entity = null,
                entityId = null,
                details = null,
                ipAddress = null,
                status = 'SUCCESS'
            } = logData;

            if (!action) {
                console.warn('[AuditLogService] Warning: logAction called without action parameter');
                return null;
            }

            const entry = await AuditLog.create({
                userId,
                userRole,
                userEmail,
                action,
                entity,
                entityId: entityId ? String(entityId) : null,
                details,
                ipAddress,
                status
            });

            return entry;
        } catch (error) {
            console.error('❌ [AuditLogService] Failed to record audit log:', error.message);
            // Return null without throwing to protect primary execution flow
            return null;
        }
    }

    /**
     * Fetch audit logs with filtering and pagination for admin panel
     */
    async getAuditLogs(filters = {}) {
        const {
            page = 1,
            limit = 20,
            action,
            entity,
            userRole,
            search,
            startDate,
            endDate
        } = filters;

        const parsedPage = Math.max(1, parseInt(page, 10) || 1);
        const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const offset = (parsedPage - 1) * parsedLimit;

        const where = {};

        if (action) {
            where.action = { [Op.iLike]: `%${action}%` };
        }
        if (entity) {
            where.entity = entity;
        }
        if (userRole) {
            where.userRole = userRole;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }
        if (search) {
            where[Op.or] = [
                { userEmail: { [Op.iLike]: `%${search}%` } },
                { action: { [Op.iLike]: `%${search}%` } },
                { entity: { [Op.iLike]: `%${search}%` } },
                { entityId: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await AuditLog.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parsedLimit,
            offset
        });

        return {
            total: count,
            page: parsedPage,
            totalPages: Math.ceil(count / parsedLimit),
            limit: parsedLimit,
            logs: rows
        };
    }
}

module.exports = new AuditLogService();
