/**
 * admin.controller.js
 * Handles admin authentication and returns a JWT on success.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin.model');

const AdminController = {
    /**
     * POST /api/admin/login
     * Body: { username, password }
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'username and password are required.' });
            }

            const admin = AdminModel.findByUsername(username);
            if (!admin) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { id: admin.id, username: admin.username },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({ message: 'Login successful.', token });
        } catch (err) {
            console.error('[AdminController.login]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
};

module.exports = AdminController;
