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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">👨‍💼</div>
                    <h1 className="text-2xl font-bold text-gray-800">แอดมิน</h1>
                    <p className="text-gray-400 text-sm">เข้าสู่ระบบเพื่อจัดการร้านค้า</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>
                    )}

                    <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>
        </div>
    );
}
