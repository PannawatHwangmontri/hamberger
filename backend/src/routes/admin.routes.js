/**
 * admin.routes.js
 * POST /api/admin/login
 */
const express = require('express');
const AdminController = require('../controllers/admin.controller');

const router = express.Router();

router.post('/login', AdminController.login);

module.exports = router;
