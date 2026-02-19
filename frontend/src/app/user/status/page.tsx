"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getOrderById, type Order } from "@/lib/api";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
    pending: "⏳ รอดำเนินการ",
    cooking: "👨‍🍳 กำลังทำอาหาร",
    completed: "✅ เสร็จแล้ว",
};
const STATUS_CLASS: Record<string, string> = {
    pending: "badge-pending",
    cooking: "badge-cooking",
    completed: "badge-completed",
};

function StatusContent() {
    const params = useSearchParams();
    const [orderId, setOrderId] = useState(params.get("id") ?? "");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function check() {
        if (!orderId) return;
        setLoading(true);
        setError("");
        try {
            const o = await getOrderById(orderId);
            setOrder(o);
        } catch {
            setError("ไม่พบออเดอร์นี้");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    }

    // Auto-check if id in query
    useEffect(() => {
        if (params.get("id")) check();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-amber-50 p-4">
            <div className="max-w-lg mx-auto">
                <Link href="/user" className="text-amber-600 hover:underline text-sm mb-4 inline-block">← กลับไปเมนู</Link>
                <h1 className="text-2xl font-bold text-amber-800 mb-6">🔍 ตรวจสอบสถานะออเดอร์</h1>

                <div className="card p-5 mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">หมายเลขออเดอร์</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="เช่น 1, 2, 3..."
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                        />
                        <button onClick={check} disabled={loading} className="btn-primary">
                            {loading ? "..." : "ค้นหา"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                {order && (
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400">ออเดอร์ #{order.id}</p>
                                <p className="font-bold text-gray-800">โต๊ะ {order.table_number}</p>
                            </div>
                            <span className={STATUS_CLASS[order.status]}>
                                {STATUS_LABEL[order.status]}
                            </span>
                        </div>

                        <div className="divide-y border-t border-b my-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-700">{item.product_name} × {item.quantity}</span>
                                    <span className="font-semibold">฿{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-2">
                            <span>ยอดรวม</span>
                            <span className="text-amber-600">฿{order.total_price}</span>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            สั่งเมื่อ {new Date(order.created_at).toLocaleString("th-TH")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function StatusPage() {
    return (
        <Suspense>
            <StatusContent />
        </Suspense>
    );
}
