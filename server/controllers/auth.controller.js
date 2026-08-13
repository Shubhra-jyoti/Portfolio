const Admin = require('../models/Admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// 2. The secure login function
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find the user
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ status: "error", message: "Access Denied. Invalid credentials." });
        }

        // Check the encrypted password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Access Denied. Invalid credentials." });
        }

        // Generate the VIP JWT Token valid for 24 hours
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ status: "success", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ status: "error", message: "Authentication server failure." });
    }
};

module.exports = { login };