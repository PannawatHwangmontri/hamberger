import { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = "hamberger-secret-key-change-me-in-prod";

export async function signToken(payload: any) {
    // Add expiry: 7 days from now (Hono v4 jwt verify requires exp)
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    return await sign({ ...payload, exp }, JWT_SECRET);
}

export async function verifyToken(token: string) {
    try {
        return await verify(token, JWT_SECRET, "HS256");
    } catch (e) {
        console.error("JWT verify failed:", e);
        return null;
    }
}

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);

    if (!payload) {
        return c.json({ message: "Invalid token" }, 401);
    }

    c.set("user", payload);
    await next();
}

