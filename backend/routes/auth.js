const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Customer, Vendor } = require('../models');
const Validation = require('../validations/requestValidation');

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

router.post('/register', Validation.register, async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const Model = role === 'vendor' ? Vendor : Customer;

        await Model.create({ name, phone, email, password: hashedPassword });
        res.json({ message: "Registration successful" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', Validation.login, async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const Model = role === 'vendor' ? Vendor : Customer;

        const user = await Model.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
