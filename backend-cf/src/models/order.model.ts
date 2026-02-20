import { D1Database } from "@cloudflare/workers-types";

export interface Order {
    id?: number;
    table_number: number;
    status: string;
    total_price: number;
    items: OrderItem[];
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    price?: number;
}

export class OrderModel {
    constructor(private db: D1Database) { }

    async getAll() {
        // 1. Get all orders
        const { results: orders } = await this.db
            .prepare("SELECT * FROM orders ORDER BY created_at DESC")
            .all();

        // 2. Get all items (D1 doesn't support complex JSON_GROUP_ARRAY easily yet, valid strategy is Fetch All Items or N+1 efficiently)
        // For simplicity with small scale: Fetch all items for these orders
        if (orders.length === 0) return [];

        const orderIds = orders.map((o: any) => o.id).join(",");
        const { results: items } = await this.db
            .prepare(
                `SELECT oi.*, p.name as product_name 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id IN (${orderIds})`
            )
            .all();

        // 3. Map items to orders
        return orders.map((o: any) => ({
            ...o,
            items: items.filter((i: any) => i.order_id === o.id),
        }));
    }

    async getById(id: number) {
        const order = await this.db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
        if (!order) return null;

        const { results: items } = await this.db
            .prepare(
                `SELECT oi.*, p.name as product_name 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`
            )
            .bind(id)
            .all();

        return { ...order, items };
    }

    async create(table_number: number, items: OrderItem[]) {
        // D1 supports batching but not full transactions across async calls easily in all environments
        // But we can use batch() for atomic operations if we prep prepared statements.
        // NOTE: For simple logic, we will insert order first then items.
        // To strictly use transaction, would use `db.batch([...])`.

        // 1. Calculate total (fetch prices)
        let total = 0;
        const finalItems = [];

        for (const item of items) {
            const p: any = await this.db
                .prepare("SELECT price, name FROM products WHERE id = ?")
                .bind(item.product_id)
                .first();
            if (p) {
                total += p.price * item.quantity;
                finalItems.push({ ...item, price: p.price, name: p.name }); // Keep metadata
            }
        }

        // 2. Insert Order
        const orderRes = await this.db
            .prepare("INSERT INTO orders (table_number, total_price) VALUES (?, ?)")
            .bind(table_number, total)
            .run();
        const orderId = orderRes.meta.last_row_id;

        // 3. Insert Items (Batch) — guard against empty array (D1 throws on batch([]))
        if (finalItems.length === 0) {
            throw new Error("ไม่พบสินค้าที่เลือก กรุณาตรวจสอบรายการอีกครั้ง");
        }
        const stmts = finalItems.map((item) =>
            this.db
                .prepare(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
                )
                .bind(orderId, item.product_id, item.quantity, item.price)
        );
        await this.db.batch(stmts);

        return this.getById(orderId);
    }

    async updateStatus(id: number, status: string) {
        await this.db
            .prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
            .bind(status, id)
            .run();
        return this.getById(id);
    }

    async remove(id: number) {
        await this.db.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
    }
}
