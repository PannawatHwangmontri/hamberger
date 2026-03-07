"use client";

import { useEffect, useState, useCallback } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMPTY_FORM = { name: "", description: "", price: "", image_url: "", is_available: "1" };

export default function AdminProductsPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const t = localStorage.getItem("admin_token");
        if (!t) { router.push("/admin/login"); return; }
        setToken(t);
    }, [router]);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try { setProducts(await getProducts()); } catch { setError("โหลดสินค้าไม่ได้"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { if (token) loadProducts(); }, [token, loadProducts]);

    function openAdd() { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }
    function openEdit(p: Product) {
        setEditing(p);
        setForm({ name: p.name, description: p.description, price: String(p.price), image_url: p.image_url, is_available: String(p.is_available) });
        setShowForm(true);
    }

    async function handleSave() {
        setSaving(true); setError("");
        try {
            const data = { name: form.name, description: form.description, price: Number(form.price), image_url: form.image_url, is_available: Number(form.is_available) };
            if (editing) { await updateProduct(editing.id, data, token!); }
            else { await createProduct(data, token!); }
            setShowForm(false);
            loadProducts();
        } catch { setError("บันทึกไม่สำเร็จ"); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: number) {
        if (!confirm("ยืนยันลบสินค้านี้?")) return;
        try { await deleteProduct(id, token!); loadProducts(); } catch { setError("ลบไม่สำเร็จ"); }
    }

    function logout() { localStorage.removeItem("admin_token"); router.push("/admin/login"); }

    return (
        <div className="min-h-screen bg-peach-50">
            {/* Navbar */}
            <nav className="bg-white shadow-peach border-b border-peach-100">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <span className="font-black text-xl text-peach-700">🍔 Admin</span>
                        <Link href="/admin/products" className="nav-active">สินค้า</Link>
                        <Link href="/admin/orders" className="nav-link">ออเดอร์</Link>
                    </div>
                    <button onClick={logout} className="btn-ghost text-sm">ออกจากระบบ</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black text-peach-800">จัดการสินค้า</h1>
                    <button onClick={openAdd} className="btn-primary">+ เพิ่มสินค้า</button>
                </div>

                {error && (
                    <p className="text-red-500 mb-4 bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl text-sm font-semibold">
                        ⚠️ {error}
                    </p>
                )}

                {loading ? (
                    <div className="text-center py-16">
                        <div className="text-4xl animate-float mb-3">🍔</div>
                        <p className="text-peach-400 font-semibold">กำลังโหลด...</p>
                    </div>
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-peach-50 border-b border-peach-100">
                                <tr>
                                    {["ID", "ชื่อสินค้า", "ราคา", "สถานะ", "จัดการ"].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 font-black text-peach-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-peach-50">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-peach-50 transition-colors">
                                        <td className="px-4 py-3 text-peach-400 font-semibold">#{p.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-black text-peach-800">{p.name}</p>
                                            <p className="text-peach-400 text-xs truncate max-w-xs font-medium">{p.description}</p>
                                        </td>
                                        <td className="px-4 py-3 font-black text-peach-600">฿{p.price}</td>
                                        <td className="px-4 py-3">
                                            <span className={p.is_available ? "badge-completed" : "badge-pending"}>
                                                {p.is_available ? "พร้อมขาย" : "หมด"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button onClick={() => openEdit(p)} className="btn-ghost text-xs py-1">แก้ไข</button>
                                            <button onClick={() => handleDelete(p.id)} className="btn-danger text-xs py-1">ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <p className="text-center text-peach-400 py-10 font-semibold">ยังไม่มีสินค้า</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-peach-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-peach-lg w-full max-w-md p-6 animate-slide-up">
                        <h2 className="text-xl font-black text-peach-800 mb-5">
                            {editing ? "✏️ แก้ไขสินค้า" : "🆕 เพิ่มสินค้าใหม่"}
                        </h2>
                        <div className="space-y-3">
                            {[
                                { label: "ชื่อสินค้า*", key: "name", type: "text" },
                                { label: "คำอธิบาย", key: "description", type: "text" },
                                { label: "ราคา (บาท)*", key: "price", type: "number" },
                                { label: "URL รูปภาพ", key: "image_url", type: "text" },
                            ].map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-bold text-peach-700 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                        className="input-primary"
                                    />
                                </div>
                            ))}
                            {form.image_url && (
                                <img src={form.image_url} alt="preview" className="w-full h-36 object-cover rounded-2xl border border-peach-100" onError={(e) => (e.currentTarget.style.display = "none")} />
                            )}
                            <div>
                                <label className="block text-sm font-bold text-peach-700 mb-1">สถานะ</label>
                                <select
                                    value={form.is_available}
                                    onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.value }))}
                                    className="input-primary"
                                >
                                    <option value="1">พร้อมขาย</option>
                                    <option value="0">หมด/ปิด</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-3 font-semibold">⚠️ {error}</p>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 btn-ghost">ยกเลิก</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary justify-center disabled:opacity-60">
                                {saving ? "⏳ กำลังบันทึก..." : "💾 บันทึก"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
