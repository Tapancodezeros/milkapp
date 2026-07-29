const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access Denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
