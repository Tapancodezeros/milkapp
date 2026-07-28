class Validation {
    static register(req, res, next) {
        const { name, phone, email, password, role } = req.body;
        if (!name || name.length < 2 || name.length > 50) return res.status(400).json({ error: "Name must be between 2 and 50 characters" });

        const digits = String(phone || '').replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) return res.status(400).json({ error: "Phone number must contain between 10 and 15 digits" });

        if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
        if (!['customer', 'vendor'].includes(role)) return res.status(400).json({ error: "Invalid role" });
        if (!email || !email.includes('@')) return res.status(400).json({ error: "Invalid email" });
        next();
    }

    static login(req, res, next) {
        const { identifier, password, role } = req.body;
        if (!identifier || !password || !role) return res.status(400).json({ error: "Missing required fields" });
        next();
    }

    static subscribe(req, res, next) {
        const { vendorId, quantity, duration } = req.body;
        if (!vendorId || !quantity || !duration) return res.status(400).json({ error: "Missing required fields" });
        
        const numVendorId = parseInt(vendorId, 10);
        const numQty = parseFloat(quantity);
        if (isNaN(numVendorId) || numVendorId <= 0) return res.status(400).json({ error: "Invalid vendor ID" });
        if (isNaN(numQty) || !Number.isFinite(numQty) || numQty < 0.1 || numQty > 50) {
            return res.status(400).json({ error: "Quantity must be between 0.1L and 50L per day" });
        }
        if (!['7_days', '1_month', '3_months'].includes(duration)) return res.status(400).json({ error: "Invalid duration" });
        next();
    }

    static buy(req, res, next) {
        const { vendorId, quantity } = req.body;
        if (!vendorId || quantity === undefined) return res.status(400).json({ error: "Missing required fields" });

        const numVendorId = parseInt(vendorId, 10);
        const numQty = parseFloat(quantity);
        if (isNaN(numVendorId) || numVendorId <= 0) return res.status(400).json({ error: "Invalid vendor ID" });
        if (isNaN(numQty) || !Number.isFinite(numQty) || numQty < 0.1 || numQty > 100) {
            return res.status(400).json({ error: "Purchase quantity must be between 0.1L and 100L" });
        }
        next();
    }

    static vendorUpdate(req, res, next) {
        const { rate, addMilk, removeMilk } = req.body;
        if (rate !== undefined) {
            const numRate = parseFloat(rate);
            if (isNaN(numRate) || !Number.isFinite(numRate) || numRate < 20 || numRate > 200) {
                return res.status(400).json({ error: "Milk rate must be between ₹20 and ₹200 per liter" });
            }
        }
        if (addMilk !== undefined) {
            const milkToAdd = parseFloat(addMilk);
            if (isNaN(milkToAdd) || !Number.isFinite(milkToAdd) || milkToAdd <= 0) {
                return res.status(400).json({ error: "Add amount must be a positive number greater than 0" });
            }
        }
        if (removeMilk !== undefined) {
            const milkToRemove = parseFloat(removeMilk);
            if (isNaN(milkToRemove) || !Number.isFinite(milkToRemove) || milkToRemove <= 0) {
                return res.status(400).json({ error: "Remove amount must be a positive number greater than 0" });
            }
        }
        next();
    }

    static topup(req, res, next) {
        const { amount, password, isDemoCard } = req.body;
        if (amount === undefined || amount === null) return res.status(400).json({ error: "Topup amount is required" });
        if (!isDemoCard && (!password || typeof password !== 'string' || !password.trim())) {
            return res.status(400).json({ error: "Password is required for top-up" });
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || !Number.isFinite(numAmount) || numAmount < 10 || numAmount > 50000) {
            return res.status(400).json({ error: "Topup amount must be a valid number between ₹10 and ₹50,000" });
        }
        next();
    }

    static withdraw(req, res, next) {
        const { amount, password } = req.body;
        if (amount === undefined || amount === null) return res.status(400).json({ error: "Withdrawal amount is required" });
        if (!password || typeof password !== 'string' || !password.trim()) {
            return res.status(400).json({ error: "Password is required for withdrawal" });
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || !Number.isFinite(numAmount) || numAmount < 10 || numAmount > 50000) {
            return res.status(400).json({ error: "Withdrawal amount must be a valid number between ₹10 and ₹50,000" });
        }
        next();
    }

    static payTransaction(req, res, next) {
        const txId = parseInt(req.params.id, 10);
        if (isNaN(txId) || txId <= 0) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
        next();
    }

    static forgotPassword(req, res, next) {
        const { email, role } = req.body;
        if (!email || !role) return res.status(400).json({ error: "Email and Role are required" });
        next();
    }

    static resetPassword(req, res, next) {
        const { token, newPassword, role } = req.body;
        if (!token || !newPassword || !role) return res.status(400).json({ error: "Token, New Password, and Role are required" });
        if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
        next();
    }

    static updateProfile(req, res, next) {
        const { name, phone, password } = req.body;
        if (name && (name.length < 2 || name.length > 50)) return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
        if (phone) {
            const digits = String(phone).replace(/\D/g, '');
            if (digits.length < 10 || digits.length > 15) return res.status(400).json({ error: "Phone number must contain between 10 and 15 digits" });
        }
        if (password && password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
        next();
    }
}

module.exports = Validation;
