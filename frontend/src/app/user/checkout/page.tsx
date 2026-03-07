"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [tableNumber, setTableNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleOrder() {
        if (!tableNumber || isNaN(Number(tableNumber))) {
            setError("กรุณากรอกหมายเลขโต๊ะให้ถูกต้อง");
            return;
        }
        if (items.length === 0) {
            setError("ตะกร้าว่างเปล่า");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const order = await createOrder(
                Number(tableNumber),
                items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
            );
            clearCart();
            router.push(`/user/status?id=${order.id}`);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-peach-50 p-4">
            <div className="max-w-lg mx-auto pt-6">
                <Link href="/user" className="text-peach-600 hover:text-peach-700 text-sm mb-5 inline-flex items-center gap-1 font-semibold transition-colors">
                    ← กลับไปเมนู
                </Link>
                <h1 className="text-2xl font-black text-peach-800 mb-6">📋 สรุปออเดอร์</h1>

                {items.length === 0 ? (
                    <div className="card p-10 text-center">
                        <p className="text-5xl mb-3">🛒</p>
                        <p className="text-peach-500 font-semibold mb-4">ตะกร้าว่างเปล่า</p>
                        <Link href="/user" className="btn-primary inline-flex">เลือกเมนู</Link>
                    </div>
                ) : (
                    <>
                        {/* Order Items */}
                        <div className="card divide-y divide-peach-100 mb-5">
                            {items.map((i) => (
                                <div key={i.product.id} className="flex justify-between px-5 py-3.5">
                                    <div>
                                        <span className="font-bold text-peach-800">{i.product.name}</span>
                                        <span className="text-peach-400 text-sm ml-2 font-medium">× {i.quantity}</span>
                                    </div>
                                    <span className="font-black text-peach-600">฿{i.product.price * i.quantity}</span>
                                </div>
                            ))}
                            <div className="flex justify-between px-5 py-4 font-black text-lg bg-peach-50">
                                <span className="text-peach-800">รวม</span>
                                <span className="text-peach-600">฿{total}</span>
                            </div>
                        </div>

                        {/* Table number */}
                        <div className="card p-5 mb-5">
                            <label className="block text-sm font-bold text-peach-700 mb-2">
                                🪑 หมายเลขโต๊ะ
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="เช่น 5"
                                className="input-primary text-lg"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl font-semibold">
                                ⚠️ {error}
                            </p>
                        )}

                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            className="w-full btn-primary justify-center text-lg py-4 disabled:opacity-60"
                        >
                            {loading ? "⏳ กำลังส่งออเดอร์..." : "✅ ยืนยันออเดอร์"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
