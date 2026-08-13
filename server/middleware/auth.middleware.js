require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ status: "error", message: "Access Denied. No digital signature provided." });
    }

    try {
        // Strip the "Bearer " prefix and verify the token
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.admin = verified; 
        next(); // Token is valid, let them through to update the database
    } catch (error) {
        res.status(400).json({ status: "error", message: "Invalid or expired digital signature." });
    }
};

module.exports = verifyToken;