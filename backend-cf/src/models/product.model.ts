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
        const { results } = await this.db
            .prepare("SELECT * FROM products ORDER BY id ASC")
            .all();
        return results as unknown as Product[];
    }

    async getById(id: number) {
        return await this.db
            .prepare("SELECT * FROM products WHERE id = ?")
            .bind(id)
            .first<Product>();
    }

    async create(data: Omit<Product, "id">) {
        const {
            name,
            description = "",
            price,
            image_url = "",
            is_available = 1,
        } = data;

        const result = await this.db
            .prepare(
                "INSERT INTO products (name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?)"
            )
            .bind(name, description, price, image_url, is_available)
            .run();

        const id = result.meta.last_row_id;
        return this.getById(id);
    }

    async update(id: number, data: Partial<Product>) {
        // First fetch existing product so we never send undefined to D1
        const existing = await this.getById(id);
        if (!existing) return null;

        const name = data.name ?? existing.name;
        const description = data.description ?? existing.description;
        const price = data.price ?? existing.price;
        const image_url = data.image_url ?? existing.image_url;
        const is_available =
            data.is_available !== undefined
                ? data.is_available
                : existing.is_available;

        await this.db
            .prepare(
                "UPDATE products SET name=?1, description=?2, price=?3, image_url=?4, is_available=?5 WHERE id=?6"
            )
            .bind(name, description, price, image_url, is_available, id)
            .run();

        return this.getById(id);
    }

    async remove(id: number) {
        await this.db
            .prepare("DELETE FROM products WHERE id = ?")
            .bind(id)
            .run();
    }
}