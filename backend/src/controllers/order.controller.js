/**
 * order.controller.js
 * Handles order creation, retrieval, status updates, and deletion.
 */
const OrderModel = require('../models/order.model');

const OrderController = {
    /** POST /api/orders  — public */
    createOrder(req, res) {
        try {
            const { table_number, items } = req.body;

            if (!table_number || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    message: 'table_number and a non-empty items array are required.',
                });
            }

            for (const item of items) {
                if (!item.product_id || !item.quantity || item.quantity < 1) {
                    return res.status(400).json({
                        message: 'Each item must have a valid product_id and quantity >= 1.',
                    });
                }
            }

            const order = OrderModel.create({ table_number, items });
            return res.status(201).json(order);
        } catch (err) {
            console.error('[OrderController.createOrder]', err);
            if (err.message.includes('not found or unavailable')) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** GET /api/orders/:id  — public */
    getById(req, res) {
        try {
            const order = OrderModel.getById(Number(req.params.id));
            if (!order) {
                return res.status(404).json({ message: `Order ${req.params.id} not found.` });
            }
            return res.json(order);
        } catch (err) {
            console.error('[OrderController.getById]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** GET /api/orders  — admin */
    getAll(req, res) {
        try {
            const orders = OrderModel.getAll();
            return res.json(orders);
        } catch (err) {
            console.error('[OrderController.getAll]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** PUT /api/orders/:id/status  — admin */
    updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'status is required.' });
            }

            const existing = OrderModel.getById(Number(id));
            if (!existing) {
                return res.status(404).json({ message: `Order ${id} not found.` });
            }

            const updated = OrderModel.updateStatus(Number(id), status);
            return res.json(updated);
        } catch (err) {
            console.error('[OrderController.updateStatus]', err);
            if (err.message.includes('Invalid status')) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** DELETE /api/orders/:id  — admin */
    remove(req, res) {
        try {
            const { id } = req.params;
            const existing = OrderModel.getById(Number(id));

            if (!existing) {
                return res.status(404).json({ message: `Order ${id} not found.` });
            }

            OrderModel.remove(Number(id));
            return res.json({ message: `Order ${id} deleted.` });
        } catch (err) {
            console.error('[OrderController.remove]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
};

module.exports = OrderController;
