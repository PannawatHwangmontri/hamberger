"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { pending: "⏳ รอดำเนินการ", cooking: "👨‍🍳 ทำอาหาร", completed: "✅ เสร็จ" };

export default function AdminOrdersPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const t = localStorage.getItem("admin_token");
        if (!t) { router.push("/admin/login"); return; }
        setToken(t);
    }, [router]);

    const loadOrders = useCallback(async (t: string) => {
        setLoading(true);
        try { setOrders(await getAllOrders(t)); }
        catch { setError("โหลดออเดอร์ไม่ได้"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { if (token) loadOrders(token); }, [token, loadOrders]);

    async function changeStatus(id: number, status: string) {
        try {
            const updated = await updateOrderStatus(id, status, token!);
            setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } catch { setError("เปลี่ยนสถานะไม่ได้"); }
    }

    async function handleDelete(id: number) {
        if (!confirm("ยืนยันลบออเดอร์นี้?")) return;
        try { await deleteOrder(id, token!); setOrders((prev) => prev.filter((o) => o.id !== id)); }
        catch { setError("ลบออเดอร์ไม่ได้"); }
    }

    function logout() { localStorage.removeItem("admin_token"); router.push("/admin/login"); }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-extrabold text-xl text-amber-700">🍔 Admin</span>
                        <Link href="/admin/products" className="text-sm font-medium text-gray-500 hover:text-amber-600">สินค้า</Link>
                        <Link href="/admin/orders" className="text-sm font-medium text-amber-600 border-b-2 border-amber-500 pb-0.5">ออเดอร์</Link>
                    </div>
                    <button onClick={logout} className="btn-ghost text-sm">ออกจากระบบ</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">จัดการออเดอร์</h1>
                    <button onClick={() => token && loadOrders(token)} className="btn-ghost text-sm">🔄 รีเฟรช</button>
                </div>

                {error && <p className="text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-xl text-sm">{error}</p>}

                {loading ? (
                    <p className="text-gray-400 text-center py-16">กำลังโหลด...</p>
                ) : orders.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">ยังไม่มีออเดอร์</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card p-5">
                                <div className="flex flex-wrap gap-3 items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg text-gray-800">ออเดอร์ #{order.id}</span>
                                            <span className={`badge-${order.status}`}>{STATUS_LABEL[order.status]}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            🪑 โต๊ะ {order.table_number} • {new Date(order.created_at).toLocaleString("th-TH")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => changeStatus(order.id, e.target.value)}
                                            className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400"
                                        >
                                            <option value="pending">⏳ รอดำเนินการ</option>
                                            <option value="cooking">👨‍🍳 ทำอาหาร</option>
                                            <option value="completed">✅ เสร็จ</option>
                                        </select>
                                        <button onClick={() => handleDelete(order.id)} className="btn-danger text-sm py-1.5">ลบ</button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl divide-y overflow-hidden">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between px-4 py-2 text-sm">
                                            <span className="text-gray-700">{item.product_name} × {item.quantity}</span>
                                            <span className="font-semibold text-gray-800">฿{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-3">
                                    <span className="font-bold text-amber-600 text-lg">ยอดรวม ฿{order.total_price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
