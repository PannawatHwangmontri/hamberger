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

    useEffect(() => {
        if (params.get("id")) check();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-peach-50 p-4">
            <div className="max-w-lg mx-auto pt-6">
                <Link href="/user" className="text-peach-600 hover:text-peach-700 text-sm mb-5 inline-flex items-center gap-1 font-semibold transition-colors">
                    ← กลับไปเมนู
                </Link>
                <h1 className="text-2xl font-black text-peach-800 mb-6">🔍 ตรวจสอบสถานะออเดอร์</h1>

                <div className="card p-5 mb-5">
                    <label className="block text-sm font-bold text-peach-700 mb-2">หมายเลขออเดอร์</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="เช่น 1, 2, 3..."
                            className="input-primary flex-1"
                        />
                        <button onClick={check} disabled={loading} className="btn-primary">
                            {loading ? "..." : "ค้นหา"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 font-semibold">⚠️ {error}</p>}
                </div>

                {order && (
                    <div className="card p-5 animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-peach-400 font-semibold">ออเดอร์ #{order.id}</p>
                                <p className="font-black text-peach-800 text-lg">🪑 โต๊ะ {order.table_number}</p>
                            </div>
                            <span className={STATUS_CLASS[order.status]}>
                                {STATUS_LABEL[order.status]}
                            </span>
                        </div>

                        <div className="divide-y divide-peach-100 border-t border-b border-peach-100 my-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between py-2.5 text-sm">
                                    <span className="text-peach-700 font-semibold">{item.product_name} × {item.quantity}</span>
                                    <span className="font-black text-peach-600">฿{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between font-black text-lg pt-3">
                            <span className="text-peach-800">ยอดรวม</span>
                            <span className="text-peach-600">฿{order.total_price}</span>
                        </div>

                        <p className="text-xs text-peach-400 mt-3 font-medium">
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
