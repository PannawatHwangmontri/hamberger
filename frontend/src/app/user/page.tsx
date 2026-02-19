"use client";

import React, { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function UserMenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartOpen, setCartOpen] = useState(false);
    const { items, count, total, addItem, removeItem, setQty } = useCart();

    useEffect(() => {
        getProducts()
            .then((p) => setProducts(p.filter((x) => x.is_available === 1)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-amber-700">
                        🍔 <span>Hamberger</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/user/status" className="btn-ghost text-sm">
                            🔍 เช็คออเดอร์
                        </Link>
                        <button onClick={() => setCartOpen(true)} className="relative btn-primary">
                            🛒 ตะกร้า
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Products Grid */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-amber-800 mb-6">🍔 เมนูทั้งหมด</h1>
                {loading ? (
                    <div className="text-center py-20 text-gray-400 text-lg">กำลังโหลดเมนู...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">ไม่มีสินค้าในขณะนี้</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((p) => (
                            <div key={p.id} className="card flex flex-col">
                                <div className="h-44 bg-amber-100 flex items-center justify-center text-6xl">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                        "🍔"
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h2 className="font-bold text-gray-800 text-lg">{p.name}</h2>
                                    <p className="text-gray-500 text-sm flex-1 mt-1">{p.description}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-amber-600 font-bold text-lg">฿{p.price}</span>
                                        <button onClick={() => addItem(p)} className="btn-primary text-sm py-2 px-4">
                                            + ใส่ตะกร้า
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            {cartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col h-full">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="font-bold text-xl text-gray-800">🛒 ตะกร้า</h2>
                            <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">ตะกร้าว่าง</p>
                            ) : (
                                items.map((i) => (
                                    <div key={i.product.id} className="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
                                        <div className="text-2xl">🍔</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{i.product.name}</p>
                                            <p className="text-amber-600 text-sm font-bold">฿{i.product.price * i.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setQty(i.product.id, i.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border text-gray-600 hover:bg-red-50">−</button>
                                            <span className="w-6 text-center font-bold text-sm">{i.quantity}</span>
                                            <button onClick={() => setQty(i.product.id, i.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border text-gray-600 hover:bg-green-50">+</button>
                                        </div>
                                        <button onClick={() => removeItem(i.product.id)} className="text-red-400 hover:text-red-600 ml-1">🗑</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-5 border-t bg-white">
                            <div className="flex justify-between font-bold text-lg mb-4">
                                <span>รวมทั้งหมด</span>
                                <span className="text-amber-600">฿{total}</span>
                            </div>
                            <Link href="/user/checkout">
                                <button
                                    onClick={() => setCartOpen(false)}
                                    disabled={items.length === 0}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    สั่งอาหาร →
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
