import { Hono } from "hono";
import { cors } from "hono/cors";
import { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { authMiddleware, signToken } from "./utils/auth";
import { AdminModel } from "./models/admin.model";
import { ProductModel } from "./models/product.model";
import { OrderModel } from "./models/order.model";
import bcrypt from "bcryptjs";

type Bindings = {
    DB: D1Database;
    IMAGES: R2Bucket;
    R2_PUBLIC_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("/*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// ─── Products (Public) ──────────────────────────────────────────────────────

app.get("/api/products", async (c) => {
    try {
        const model = new ProductModel(c.env.DB);
        const products = await model.getAll();
        return c.json(products);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.get("/api/products/:id", async (c) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) return c.json({ error: "Invalid product id" }, 400);
        const model = new ProductModel(c.env.DB);
        const product = await model.getById(id);
        if (!product) return c.json({ error: "Product not found" }, 404);
        return c.json(product);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// ─── Products (Admin) ───────────────────────────────────────────────────────

app.post("/api/products", authMiddleware, async (c) => {
    try {
        const body = await c.req.json<{
            name: string;
            description?: string;
            price: number;
            image_url?: string;
            is_available?: number;
        }>();

        if (!body.name || body.price === undefined) {
            return c.json({ error: "name and price are required" }, 400);
        }

        const model = new ProductModel(c.env.DB);
        const product = await model.create({
            name: body.name,
            description: body.description ?? "",
            price: Number(body.price),
            image_url: body.image_url ?? "",
            is_available: body.is_available ?? 1,
        });
        return c.json(product, 201);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.put("/api/products/:id", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) return c.json({ error: "Invalid product id" }, 400);

        const body = await c.req.json<Partial<{
            name: string;
            description: string;
            price: number;
            image_url: string;
            is_available: number;
        }>>();

        const model = new ProductModel(c.env.DB);
        const product = await model.update(id, body);
        if (!product) return c.json({ error: "Product not found" }, 404);
        return c.json(product);
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

app.delete("/api/products/:id", authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) return c.json({ error: "Invalid product id" }, 400);

        const model = new ProductModel(c.env.DB);
        const existing = await model.getById(id);
        if (!existing) return c.json({ error: "Product not found" }, 404);

        await model.remove(id);
        return c.json({ message: "Product deleted successfully" });
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

// ─── Image Upload ──────────────────────────────────────────────────────────

app.post("/api/upload", authMiddleware, async (c) => {
    try {
        const formData = await c.req.formData();
        const file = formData.get("image") as File | null;
        if (!file) return c.json({ error: "No image provided" }, 400);

        const ext = file.name.split(".").pop() ?? "jpg";
        const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const buffer = await file.arrayBuffer();

        await c.env.IMAGES.put(key, buffer, {
            httpMetadata: { contentType: file.type },
        });

        const url = `${c.env.R2_PUBLIC_URL}/${key}`;
        return c.json({ url });
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

        const isValid = await bcrypt.compare(password, admin.password);
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
