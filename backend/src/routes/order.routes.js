/**
 * order.routes.js
 *
 * Public  : POST /api/orders
 *           GET  /api/orders/:id
 * Admin   : GET  /api/orders
 *           PUT  /api/orders/:id/status
 *           DELETE /api/orders/:id
 */
const express = require('express');
const OrderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public
router.post('/', OrderController.createOrder);
router.get('/:id', OrderController.getById);

// Admin — protected
router.get('/', verifyToken, OrderController.getAll);
router.put('/:id/status', verifyToken, OrderController.updateStatus);
router.delete('/:id', verifyToken, OrderController.remove);

module.exports = router;
