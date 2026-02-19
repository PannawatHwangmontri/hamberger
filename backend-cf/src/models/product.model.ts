import { D1Database } from "@cloudflare/workers-types";

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: number;
}

export class ProductModel {
    constructor(private db: D1Database) { }

    async getAll() {
        const { results } = await this.db.prepare("SELECT * FROM products ORDER BY id ASC").all();
        return results;
    }

    async getById(id: number) {
        return await this.db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    }

    async create(data: Product) {
        const { name, description, price, image_url, is_available } = data;
        const result = await this.db
            .prepare(
                "INSERT INTO products (name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?)"
            )
            .bind(name, description ?? "", price, image_url ?? "", is_available ?? 1)
            .run();

        // D1 .run() returns meta object
        const id = result.meta.last_row_id;
        return this.getById(id);
    }

    async update(id: number, data: Partial<Product>) {
        // Ideally, catch "Product not found" before update, or check changes
        await this.db
            .prepare(
                "UPDATE products SET name=?1, description=?2, price=?3, image_url=?4, is_available=?5 WHERE id=?6"
            )
            .bind(
                data.name,
                data.description,
                data.price,
                data.image_url,
                data.is_available,
                id
            )
            .run();

        return this.getById(id);
    }

    async remove(id: number) {
        await this.db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    }
}
