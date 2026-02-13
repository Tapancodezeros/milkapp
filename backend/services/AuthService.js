const { Customer, Vendor } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { UserRole } = require('../utils/constants');

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

class AuthService {
    async register(data) {
        const { name, phone, email, password, role } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const existingUser = await Model.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Email already registered");
        }

        await Model.create({ name, phone, email, password: hashedPassword });
        return { message: "Registration successful" };
    }

    async login(data) {
        const { identifier, password, role } = data;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { name: identifier }
                ]
            }
        });

        if (!user) {
            throw new Error("Invalid identifier or password");
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            throw new Error("Invalid identifier or password");
        }

        const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: '1h' });
        return { token, user: { id: user.id, name: user.name, role } };
    }

    async forgotPassword(data) {
        const { email, role } = data;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findOne({ where: { email } });
        if (!user) {
            throw new Error("User with this email not found");
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        console.log(`Password reset token for ${email}: ${token}`);
        return { token };
    }

    async resetPassword(data) {
        const { token, newPassword, role } = data;
        const Model = role === UserRole.VENDOR ? Vendor : Customer;

        const user = await Model.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            throw new Error("Invalid or expired reset token");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return { message: "Password reset successful" };
    }
}

module.exports = new AuthService();
