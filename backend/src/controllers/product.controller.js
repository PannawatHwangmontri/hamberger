/**
 * product.controller.js
 * Handles product CRUD operations.
 */
const ProductModel = require('../models/product.model');

const ProductController = {
    /** GET /api/products  — public */
    getAll(req, res) {
        try {
            const products = ProductModel.getAll();
            return res.json(products);
        } catch (err) {
            console.error('[ProductController.getAll]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** POST /api/products  — admin */
    create(req, res) {
        try {
            const { name, description, price, image_url, is_available } = req.body;

            if (!name || price === undefined) {
                return res.status(400).json({ message: 'name and price are required.' });
            }

            const product = ProductModel.create({ name, description, price, image_url, is_available });
            return res.status(201).json(product);
        } catch (err) {
            console.error('[ProductController.create]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** PUT /api/products/:id  — admin */
    update(req, res) {
        try {
            const { id } = req.params;
            const existing = ProductModel.getById(Number(id));

            if (!existing) {
                return res.status(404).json({ message: `Product ${id} not found.` });
            }

            const data = {
                name: req.body.name ?? existing.name,
                description: req.body.description ?? existing.description,
                price: req.body.price ?? existing.price,
                image_url: req.body.image_url ?? existing.image_url,
                is_available: req.body.is_available ?? existing.is_available,
            };

            const updated = ProductModel.update(Number(id), data);
            return res.json(updated);
        } catch (err) {
            console.error('[ProductController.update]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /** DELETE /api/products/:id  — admin */
    remove(req, res) {
        try {
            const { id } = req.params;
            const existing = ProductModel.getById(Number(id));

            if (!existing) {
                return res.status(404).json({ message: `Product ${id} not found.` });
            }

            ProductModel.remove(Number(id));
            return res.json({ message: `Product ${id} deleted.` });
        } catch (err) {
            console.error('[ProductController.remove]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
};

module.exports = ProductController;
