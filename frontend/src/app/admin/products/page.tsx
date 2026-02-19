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

    // Auth guard
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
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-extrabold text-xl text-amber-700">🍔 Admin</span>
                        <Link href="/admin/products" className="text-sm font-medium text-amber-600 border-b-2 border-amber-500 pb-0.5">สินค้า</Link>
                        <Link href="/admin/orders" className="text-sm font-medium text-gray-500 hover:text-amber-600">ออเดอร์</Link>
                    </div>
                    <button onClick={logout} className="btn-ghost text-sm">ออกจากระบบ</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">จัดการสินค้า</h1>
                    <button onClick={openAdd} className="btn-primary">+ เพิ่มสินค้า</button>
                </div>

                {error && <p className="text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

                {loading ? (
                    <p className="text-gray-400 text-center py-16">กำลังโหลด...</p>
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    {["ID", "ชื่อสินค้า", "ราคา", "สถานะ", "จัดการ"].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-amber-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400">#{p.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-800">{p.name}</p>
                                            <p className="text-gray-400 text-xs truncate max-w-xs">{p.description}</p>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-amber-600">฿{p.price}</td>
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
                        {products.length === 0 && <p className="text-center text-gray-400 py-10">ยังไม่มีสินค้า</p>}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-5">{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                        <div className="space-y-3">
                            {[
                                { label: "ชื่อสินค้า*", key: "name", type: "text" },
                                { label: "คำอธิบาย", key: "description", type: "text" },
                                { label: "ราคา (บาท)*", key: "price", type: "number" },
                                { label: "URL รูปภาพ", key: "image_url", type: "text" },
                            ].map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                                <select
                                    value={form.is_available}
                                    onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                                >
                                    <option value="1">พร้อมขาย</option>
                                    <option value="0">หมด/ปิด</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 btn-ghost">ยกเลิก</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary disabled:opacity-60">
                                {saving ? "กำลังบันทึก..." : "บันทึก"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
