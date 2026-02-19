import { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = "hamberger-secret-key-change-me-in-prod";

export async function signToken(payload: any) {
    return await sign(payload, JWT_SECRET);
}

export async function verifyToken(token: string) {
    try {
        return await verify(token, JWT_SECRET);
    } catch (e) {
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
