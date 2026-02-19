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
        <div className="min-h-screen bg-amber-50 p-4">
            <div className="max-w-lg mx-auto">
                <Link href="/user" className="text-amber-600 hover:underline text-sm mb-4 inline-block">← กลับไปเมนู</Link>
                <h1 className="text-2xl font-bold text-amber-800 mb-6">📋 สรุปออเดอร์</h1>

                {items.length === 0 ? (
                    <div className="card p-8 text-center text-gray-400">
                        <p className="text-5xl mb-3">🛒</p>
                        <p>ตะกร้าว่างเปล่า</p>
                        <Link href="/user" className="btn-primary mt-4 inline-block">เลือกเมนู</Link>
                    </div>
                ) : (
                    <>
                        {/* Order Items */}
                        <div className="card divide-y mb-5">
                            {items.map((i) => (
                                <div key={i.product.id} className="flex justify-between px-5 py-3">
                                    <div>
                                        <span className="font-semibold text-gray-800">{i.product.name}</span>
                                        <span className="text-gray-400 text-sm ml-2">× {i.quantity}</span>
                                    </div>
                                    <span className="font-bold text-amber-600">฿{i.product.price * i.quantity}</span>
                                </div>
                            ))}
                            <div className="flex justify-between px-5 py-4 font-bold text-lg">
                                <span>รวม</span>
                                <span className="text-amber-600">฿{total}</span>
                            </div>
                        </div>

                        {/* Table number */}
                        <div className="card p-5 mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🪑 หมายเลขโต๊ะ
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="เช่น 5"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            className="w-full btn-primary text-lg py-4 disabled:opacity-60"
                        >
                            {loading ? "กำลังส่งออเดอร์..." : "✅ ยืนยันออเดอร์"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
