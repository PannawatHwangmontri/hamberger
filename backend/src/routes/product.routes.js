/**
 * product.routes.js
 *
 * Public  : GET  /api/products
 * Admin   : POST /api/products
 *           PUT  /api/products/:id
 *           DELETE /api/products/:id
 */
const express = require('express');
const ProductController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/', ProductController.getAll);

// Admin — protected
router.post('/', verifyToken, ProductController.create);
router.put('/:id', verifyToken, ProductController.update);
router.delete('/:id', verifyToken, ProductController.remove);

module.exports = router;
