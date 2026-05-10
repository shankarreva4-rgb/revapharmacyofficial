// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
// Register API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if Admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        // Create new Admin
        const newAdmin = new Admin({ name, email, password });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
);

// Login API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if Admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check Password (Simple comparison for now)
        if (admin.password !== password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        res.status(200).json({ message: "Login Successful", adminId: admin._id });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
module.exports = router;