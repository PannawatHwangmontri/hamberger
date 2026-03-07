"use client";

import { useState } from "react";
import { adminLogin } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const token = await adminLogin(username, password);
            localStorage.setItem("admin_token", token);
            router.push("/admin/products");
        } catch {
            setError("username หรือ password ไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-peach-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-peach-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 bg-peach-700/40 rounded-full blur-3xl pointer-events-none" />

            <div className="glass-card bg-white/90 w-full max-w-sm p-8 relative z-10 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-3 animate-float">👨‍💼</div>
                    <h1 className="text-2xl font-black text-peach-800">แอดมิน</h1>
                    <p className="text-peach-500 text-sm font-medium mt-1">เข้าสู่ระบบเพื่อจัดการร้านค้า</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-peach-700 mb-1.5">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-primary"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-peach-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-primary"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl font-semibold">
                            ⚠️ {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60 mt-2">
                        {loading ? "⏳ กำลังเข้าสู่ระบบ..." : "🔐 เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>
        </div>
    );
}
