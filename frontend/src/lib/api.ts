// lib/api.ts — typed fetch wrappers for all backend endpoints

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function authHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: number; // 1 | 0
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    table_number: number;
    status: "pending" | "cooking" | "completed";
    total_price: number;
    created_at: string;
    items: OrderItem[];
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function createProduct(data: Omit<Product, "id">, token: string): Promise<Product> {
    const res = await fetch(`${BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

export async function updateProduct(id: number, data: Partial<Omit<Product, "id">>, token: string): Promise<Product> {
    const res = await fetch(`${BASE}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

export async function deleteProduct(id: number, token: string): Promise<void> {
    const res = await fetch(`${BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete product");
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(
    table_number: number,
    items: { product_id: number; quantity: number }[]
): Promise<Order> {
    const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number, items }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to create order");
    }
    return res.json();
}

export async function getOrderById(id: number | string): Promise<Order> {
    const res = await fetch(`${BASE}/api/orders/${id}`);
    if (!res.ok) throw new Error("Order not found");
    return res.json();
}

export async function getAllOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${BASE}/api/orders`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export async function updateOrderStatus(
    id: number,
    status: string,
    token: string
): Promise<Order> {
    const res = await fetch(`${BASE}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return res.json();
}

export async function deleteOrder(id: number, token: string): Promise<void> {
    const res = await fetch(`${BASE}/api/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete order");
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export async function adminLogin(username: string, password: string): Promise<string> {
    const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    return data.token as string;
}
