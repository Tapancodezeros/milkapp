const roleAuth = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Forbidden: Unauthorized Role" });
        }
        next();
    };
};

module.exports = roleAuth;
