const { Customer } = require('../models');
const bcrypt = require('bcryptjs');

class CustomerService {
    async getProfile(id) {
        return await Customer.findByPk(id, { attributes: ['id', 'name', 'email', 'phone', 'walletBalance'] });
    }

    async topUp(id, amount) {
        const customer = await Customer.findByPk(id);
        const newBalance = (parseFloat(customer.walletBalance) || 0) + parseFloat(amount);

        if (newBalance > 50000) {
            throw new Error(`Wallet balance cannot exceed ₹50,000. Current: ₹${customer.walletBalance}, Max top-up allowed: ₹${50000 - customer.walletBalance}`);
        }

        customer.walletBalance = newBalance;
        await customer.save();
        return { balance: customer.walletBalance };
    }

    async withdraw(id, amount) {
        const customer = await Customer.findByPk(id);
        const balance = parseFloat(customer.walletBalance) || 0;
        const withdrawAmount = parseFloat(amount);

        if (balance < withdrawAmount) {
            throw new Error(`Insufficient funds. Current balance: ₹${balance}`);
        }

        customer.walletBalance = balance - withdrawAmount;
        await customer.save();
        return { balance: customer.walletBalance };
    }

    async updateProfile(id, data) {
        const { name, phone, password } = data;
        const customer = await Customer.findByPk(id);

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
