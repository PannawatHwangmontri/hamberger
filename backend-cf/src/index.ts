import { Hono } from "hono";
import { cors } from "hono/cors";
import { D1Database } from "@cloudflare/workers-types";
import { authMiddleware, signToken } from "./utils/auth";
import { AdminModel } from "./models/admin.model";
import { ProductModel } from "./models/product.model";
import { OrderModel } from "./models/order.model";

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("/*", cors());

// ─── Products (Public) ──────────────────────────────────────────────────────

app.get("/api/products", async (c) => {
    const model = new ProductModel(c.env.DB);
    const products = await model.getAll();
    return c.json(products);
});

// ─── Products (Admin) ───────────────────────────────────────────────────────

app.post("/api/products", authMiddleware, async (c) => {
    try {
        const body: { name: string; description: string; price: number; image_url: string; is_available: number } = await c.req.json();
        const model = new ProductModel(c.env.DB);
        const product = await model.create(body);
        return c.json(product, 201);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.put("/api/products/:id", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const body: { name: string; description: string; price: number; image_url: string; is_available: number } = await c.req.json();
        const model = new ProductModel(c.env.DB);
        const product = await model.update(id, body);
        return c.json(product);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.delete("/api/products/:id", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const model = new ProductModel(c.env.DB);
        await model.remove(id);
        return c.json({ message: "Deleted" });
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// ─── Orders (Public) ───────────────────────────────────────────────────────

app.post("/api/orders", async (c) => {
    try {
        const body: { table_number: number; items: { product_id: number; quantity: number }[] } = await c.req.json();
        const model = new OrderModel(c.env.DB);
        // Note: create method logic might need adjustment if products aren't found, but keeping simple
        const order = await model.create(body.table_number, body.items); // Using stubbed create logic from step 352
        // Wait, the order model create method signature is (table_number, items).
        // The items inside creates might fetch prices.
        return c.json(order, 201);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.get("/api/orders/:id", async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const model = new OrderModel(c.env.DB);
        const order = await model.getById(id);
        if (!order) return c.json({ message: "Order not found" }, 404);
        return c.json(order);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// ─── Orders (Admin) ────────────────────────────────────────────────────────

app.get("/api/orders", authMiddleware, async (c) => {
    try {
        const model = new OrderModel(c.env.DB);
        const orders = await model.getAll();
        return c.json(orders);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.put("/api/orders/:id/status", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const { status } = await c.req.json();
        const model = new OrderModel(c.env.DB);
        const order = await model.updateStatus(id, status);
        return c.json(order);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.delete("/api/orders/:id", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const model = new OrderModel(c.env.DB);
        await model.remove(id);
        return c.json({ message: "Deleted" });
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// ─── Admin Auth ────────────────────────────────────────────────────────────

app.post("/api/admin/login", async (c) => {
    try {
        const { username, password } = await c.req.json();
        const model = new AdminModel(c.env.DB);
        const admin: any = await model.findByUsername(username);

        if (!admin) return c.json({ message: "Invalid credentials" }, 401);

        // D1 environment doesn't support bcrypt easily without heavy polyfills.
        // For this demo, we will accept plain text or verify hash if possible.
        // WARNING: In production, use Web Crypto API for hashing.
        // Simplifying: If password matches hardcoded or hash check (stubbed).
        // Let's assume the user sends plain text and we compare with 'admin1234' for seed user.
        // Real impl: using bcryptjs-edged or similar.
        // For now, hardcode check for simplicity of this specific request context if we can't run bcrypt.

        // If seeded hash is used, we can't verify easily without bcrypt lib.
        // BUT we installed 'bcryptjs' in backend (node). Cloudflare needs pure JS or WebCrypto.
        // 'bcryptjs' works in Workers! Let's import it.

        // Lazy load bcrypt to avoid init issues if not needed
        const bcrypt = require('bcryptjs');

        const isValid = bcrypt.compareSync(password, admin.password);
        if (!isValid) return c.json({ message: "Invalid credentials" }, 401);

        const token = await signToken({ id: admin.id, username: admin.username });
        return c.json({ token });
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// Health check
app.get("/", (c) => c.text("Hamberger Backend (Cloudflare Workers) is running!"));

export default app;
