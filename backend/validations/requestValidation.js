class Validation {
    static register(req, res, next) {
        const { name, phone, email, password, role } = req.body;
        if (!name || name.length < 2 || name.length > 50) return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
        if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
        if (!['customer', 'vendor'].includes(role)) return res.status(400).json({ error: "Invalid role" });
        if (!email || !email.includes('@')) return res.status(400).json({ error: "Invalid email" });
        next();
    }

    static login(req, res, next) {
        const { email, password, role } = req.body;
        if (!email || !password || !role) return res.status(400).json({ error: "Missing required fields" });
        next();
    }

    static subscribe(req, res, next) {
        const { vendorId, quantity, duration } = req.body;
        if (!vendorId || !quantity || !duration) return res.status(400).json({ error: "Missing required fields" });
        if (quantity < 0.1 || quantity > 50) return res.status(400).json({ error: "Quantity must be between 0.1L and 50L per day" });
        if (!['7_days', '1_month', '3_months'].includes(duration)) return res.status(400).json({ error: "Invalid duration" });
        next();
    }

    static buy(req, res, next) {
        const { vendorId, quantity } = req.body;
        if (!vendorId || !quantity) return res.status(400).json({ error: "Missing required fields" });
        if (quantity < 0.1 || quantity > 100) return res.status(400).json({ error: "Purchase quantity must be between 0.1L and 100L" });
        next();
    }

    static vendorUpdate(req, res, next) {
        const { rate, addMilk } = req.body;
        if (rate !== undefined && (rate < 20 || rate > 200)) return res.status(400).json({ error: "Milk rate must be between ₹20 and ₹200 per liter" });
        if (addMilk !== undefined) {
            const milkToAdd = parseFloat(addMilk);
            if (isNaN(milkToAdd) || milkToAdd <= 0) return res.status(400).json({ error: "Add amount must be greater than 0" });
        }
        next();
    }

    static topup(req, res, next) {
        const { amount } = req.body;
        if (!amount || amount < 10 || amount > 50000) return res.status(400).json({ error: "Topup amount must be between ₹10 and ₹50,000" });
        next();
    }
}

module.exports = Validation;
