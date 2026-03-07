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
        <div className="min-h-screen bg-peach-50">
            {/* Navbar */}
            <nav className="bg-white/90 backdrop-blur-md shadow-peach sticky top-0 z-40 border-b border-peach-100">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-1.5 text-peach-500 hover:text-peach-700 text-sm font-bold transition-colors">
                            ← กลับหน้าล็อคอิน
                        </Link>
                        <span className="text-peach-200">|</span>
                        <span className="font-black text-xl text-peach-700">🍔 Hamberger</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/user/status" className="btn-ghost text-sm">
                            🔍 เช็คออเดอร์
                        </Link>
                        <button onClick={() => setCartOpen(true)} className="relative btn-primary">
                            🛒 ตะกร้า
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-peach-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Products Grid */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-black text-peach-800 mb-6">🍔 เมนูทั้งหมด</h1>
                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-5xl animate-float mb-4">🍔</div>
                        <p className="text-peach-400 font-semibold">กำลังโหลดเมนู...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-peach-400 font-semibold">ไม่มีสินค้าในขณะนี้</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((p) => (
                            <div key={p.id} className="card flex flex-col hover:shadow-peach-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="h-44 bg-gradient-to-br from-peach-100 to-peach-200 flex items-center justify-center text-6xl overflow-hidden">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="animate-float">🍔</span>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h2 className="font-black text-peach-800 text-lg">{p.name}</h2>
                                    <p className="text-peach-500/80 text-sm flex-1 mt-1 font-medium">{p.description}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-peach-600 font-black text-xl">฿{p.price}</span>
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
                <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
                    <div className="absolute inset-0 bg-peach-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white shadow-peach-lg flex flex-col h-full border-l border-peach-100">
                        <div className="p-5 border-b border-peach-100 flex items-center justify-between bg-peach-50">
                            <h2 className="font-black text-xl text-peach-800">🛒 ตะกร้า</h2>
                            <button onClick={() => setCartOpen(false)} className="text-peach-400 hover:text-peach-600 text-2xl leading-none transition-colors">&times;</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="text-center text-peach-400 py-14">
                                    <div className="text-4xl mb-3">🛒</div>
                                    <p className="font-semibold">ตะกร้าว่าง</p>
                                </div>
                            ) : (
                                items.map((i) => (
                                    <div key={i.product.id} className="flex items-center gap-3 bg-peach-50 rounded-2xl p-3 border border-peach-100">
                                        <div className="text-2xl">🍔</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate text-peach-800">{i.product.name}</p>
                                            <p className="text-peach-500 text-sm font-bold">฿{i.product.price * i.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setQty(i.product.id, i.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl border border-peach-200 text-peach-600 hover:bg-red-50 transition-colors font-bold">−</button>
                                            <span className="w-6 text-center font-black text-sm text-peach-800">{i.quantity}</span>
                                            <button onClick={() => setQty(i.product.id, i.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl border border-peach-200 text-peach-600 hover:bg-peach-100 transition-colors font-bold">+</button>
                                        </div>
                                        <button onClick={() => removeItem(i.product.id)} className="text-red-400 hover:text-red-600 ml-1 transition-colors">🗑</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-5 border-t border-peach-100 bg-peach-50">
                            <div className="flex justify-between font-black text-lg mb-4 text-peach-800">
                                <span>รวมทั้งหมด</span>
                                <span className="text-peach-600">฿{total}</span>
                            </div>
                            <Link href="/user/checkout">
                                <button
                                    onClick={() => setCartOpen(false)}
                                    disabled={items.length === 0}
                                    className="w-full btn-primary justify-center text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
