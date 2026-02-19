/**
 * order.model.js
 * Database access for the orders and order_items tables.
 */
const db = require('../database/db');

const OrderModel = {
    /**
     * Create an order with its items inside a transaction.
     * @param {{ table_number: number, items: Array<{ product_id, quantity }> }} data
     * @returns {Object} the created order with its items
     */
    create({ table_number, items }) {
        const createOrder = db.transaction(({ table_number, items }) => {
            // Validate items and compute total price
            let total_price = 0;
            const enrichedItems = items.map((item) => {
                const product = db
                    .prepare('SELECT * FROM products WHERE id = ? AND is_available = 1')
                    .get(item.product_id);

                if (!product) {
                    throw new Error(`Product id ${item.product_id} not found or unavailable`);
                }

                const linePrice = product.price * item.quantity;
                total_price += linePrice;
                return { ...item, price: product.price };
            });

            // Insert order
            const orderResult = db
                .prepare(
                    'INSERT INTO orders (table_number, total_price) VALUES (?, ?)'
                )
                .run(table_number, total_price);

            const orderId = orderResult.lastInsertRowid;

            // Insert order items
            const insertItem = db.prepare(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
            );
            for (const item of enrichedItems) {
                insertItem.run(orderId, item.product_id, item.quantity, item.price);
            }

            return this.getById(orderId);
        });

        return createOrder({ table_number, items });
    },

    /**
     * Get a single order (with items) by id.
     * @param {number} id
     */
    getById(id) {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) return null;

        order.items = db
            .prepare(
                `SELECT oi.*, p.name AS product_name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`
            )
            .all(id);

        return order;
    },

    /** Get all orders (with items) */
    getAll() {
        const orders = db
            .prepare('SELECT * FROM orders ORDER BY created_at DESC')
            .all();

        const getItems = db.prepare(
            `SELECT oi.*, p.name AS product_name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`
        );

        return orders.map((order) => ({
            ...order,
            items: getItems.all(order.id),
        }));
    },

    /**
     * Update order status.
     * @param {number} id
     * @param {string} status  'pending' | 'cooking' | 'completed'
     */
    updateStatus(id, status) {
        const VALID = ['pending', 'cooking', 'completed'];
        if (!VALID.includes(status)) {
            throw new Error(`Invalid status "${status}". Must be one of: ${VALID.join(', ')}`);
        }
        db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
        return this.getById(id);
    },

    /** Delete an order (items cascade) */
    remove(id) {
        return db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    },
};

module.exports = OrderModel;
