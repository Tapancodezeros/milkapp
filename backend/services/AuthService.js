const { Customer, Vendor, Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');
const AppError = require('../utils/appError');
const AuditLogService = require('./AuditLogService');

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

class AuthService {
    getModel(role) {
        switch (role) {
            case UserRole.VENDOR: return Vendor;
            case UserRole.ADMIN: return Admin;
            default: return Customer;
        }
    }

    async register(data) {
        const { name, phone, email, password, role } = data;
        const normalizedEmail = email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const Model = this.getModel(role);

        const existingUser = await Model.findOne({
            where: {
                [Op.or]: [
                    { email: normalizedEmail },
                    { phone },
                    { name }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === normalizedEmail) {
                throw new AppError("Email already registered", 409);
            }
            if (existingUser.phone === phone) {
                throw new AppError("Phone number already registered", 409);
            }
            throw new AppError("Name already registered", 409);
        }

        const newUser = await Model.create({
            name,
            phone,
            email: normalizedEmail,
            password: hashedPassword
        });

        AuditLogService.logAction({
            userId: newUser.id,
            userRole: role,
            userEmail: normalizedEmail,
            action: 'USER_REGISTER',
            entity: 'Auth',
            entityId: newUser.id,
            details: { name, phone, role }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        console.log(`[WELCOME] User ${normalizedEmail} registered. Login at: ${frontendUrl}`);
        return { message: "Registration successful", loginLink: frontendUrl };
    }

    async login(data) {
        const { identifier, password, role } = data;
        const Model = this.getModel(role);
        const normalizedIdentifier = identifier.trim();

        const user = await Model.findOne({
            where: {
                [Op.or]: [
                    { email: normalizedIdentifier.toLowerCase() },
                    { phone: normalizedIdentifier },
                    { name: { [Op.iLike]: normalizedIdentifier } },
                    { name: { [Op.iLike]: `%${normalizedIdentifier}%` } }
                ]
            }
        });

        if (!user) {
            AuditLogService.logAction({
                userRole: role,
                action: 'USER_LOGIN_FAILED',
                entity: 'Auth',
                details: { identifier: normalizedIdentifier, reason: 'User not found' },
                status: 'FAILED'
            });
            throw new AppError("Invalid identifier or password", 401);
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            AuditLogService.logAction({
                userId: user.id,
                userRole: role,
                userEmail: user.email,
                action: 'USER_LOGIN_FAILED',
                entity: 'Auth',
                entityId: user.id,
                details: { reason: 'Invalid password' },
                status: 'FAILED'
            });
            throw new AppError("Invalid identifier or password", 401);
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn });

        AuditLogService.logAction({
            userId: user.id,
            userRole: role,
            userEmail: user.email,
            action: 'USER_LOGIN',
            entity: 'Auth',
            entityId: user.id,
            details: { role }
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role
            }
        };
    }

    async forgotPassword(data) {
        const { email, role } = data;
        const Model = this.getModel(role);

        const user = await Model.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) {
            throw new AppError("User with this email not found", 404);
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&role=${role}`;

        console.log(`Password reset link for ${email}: ${resetLink}`);
        return { token, resetLink };
    }

    async resetPassword(data) {
        const { token, newPassword, role } = data;
        const Model = this.getModel(role);

        const user = await Model.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            throw new AppError("Invalid or expired reset token", 400);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return { message: "Password reset successful" };
    }
}

module.exports = new AuthService();
