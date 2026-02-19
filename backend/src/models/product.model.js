/**
 * product.model.js
 * Database access for the products table.
 */
const db = require('../database/db');

const ProductModel = {
    /** Get all products */
    getAll() {
        return db.prepare('SELECT * FROM products ORDER BY id ASC').all();
    },

    /** Get product by id */
    getById(id) {
        return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    },

    /**
     * Create a new product.
     * @param {{ name, description, price, image_url, is_available }} data
     */
    create({ name, description, price, image_url, is_available }) {
        const stmt = db.prepare(
            `INSERT INTO products (name, description, price, image_url, is_available)
       VALUES (@name, @description, @price, @image_url, @is_available)`
        );
        const result = stmt.run({ name, description, price, image_url, is_available: is_available ?? 1 });
        return this.getById(result.lastInsertRowid);
    },

    /**
     * Update an existing product.
     * @param {number} id
     * @param {{ name, description, price, image_url, is_available }} data
     */
    update(id, { name, description, price, image_url, is_available }) {
        db.prepare(
            `UPDATE products
       SET name=@name, description=@description, price=@price,
           image_url=@image_url, is_available=@is_available
       WHERE id=@id`
        ).run({ id, name, description, price, image_url, is_available });
        return this.getById(id);
    },

    /** Delete a product by id */
    remove(id) {
        return db.prepare('DELETE FROM products WHERE id = ?').run(id);
    },
};

module.exports = ProductModel;
