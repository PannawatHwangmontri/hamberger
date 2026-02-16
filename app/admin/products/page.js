'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminNav from '@/components/AdminNav';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '@/lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burger',
    image_url: '',
    is_recommended: false,
    is_available: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await adminGetProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'burger',
      image_url: '',
      is_recommended: false,
      is_available: true,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      is_recommended: !!product.is_recommended,
      is_available: !!product.is_available,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        is_recommended: formData.is_recommended ? 1 : 0,
        is_available: formData.is_available ? 1 : 0,
      };

      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, data);
        alert('แก้ไขสินค้าสำเร็จ');
      } else {
        await adminCreateProduct(data);
        alert('เพิ่มสินค้าสำเร็จ');
      }

      setShowModal(false);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('ไม่สามารถบันทึกสินค้าได้');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณต้องการลบสินค้านี้หรือไม่?')) return;

    try {
      await adminDeleteProduct(id);
      alert('ลบสินค้าสำเร็จ');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('ไม่สามารถลบสินค้าได้');
    }
  };

  const getCategoryLabel = (category) => {
    const map = {
      burger: '🍔 เบอร์เกอร์',
      side: '🍟 เครื่องเคียง',
      drink: '🥤 เครื่องดื่ม',
    };
    return map[category] || category;
  };

  if (loading) {
    return (
      <AdminNav>
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl animate-bounce">⏳ กำลังโหลด...</div>
        </div>
      </AdminNav>
    );
  }

  return (
    <AdminNav>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-burger-dark">🍔 จัดการสินค้า</h2>
          <p className="text-gray-600 mt-1">สินค้าทั้งหมด: {products.length} รายการ</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-burger-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
        >
          ➕ เพิ่มสินค้าใหม่
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-6xl mb-4">🍔</p>
          <p className="text-xl text-gray-600">ยังไม่มีสินค้า</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.is_recommended === 1 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-burger-dark px-3 py-1 rounded-full font-bold text-sm">
                    ⭐ แนะนำ
                  </div>
                )}
                {product.is_available === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                      ไม่พร้อมขาย
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-burger-dark">{product.name}</h3>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {getCategoryLabel(product.category)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-burger-red">฿{product.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                  >
                    ✏️ แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-burger-red text-white p-6 flex justify-between items-center sticky top-0">
              <h3 className="text-2xl font-bold">
                {editingProduct ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-3xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">ชื่อสินค้า *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">ราคา (บาท) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">หมวดหมู่ *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none"
                  >
                    <option value="burger">🍔 เบอร์เกอร์</option>
                    <option value="side">🍟 เครื่องเคียง</option>
                    <option value="drink">🥤 เครื่องดื่ม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">URL รูปภาพ</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_recommended}
                    onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                    className="w-5 h-5 text-burger-red focus:ring-burger-red"
                  />
                  <span className="font-bold text-gray-700">⭐ สินค้าแนะนำ</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-5 h-5 text-burger-red focus:ring-burger-red"
                  />
                  <span className="font-bold text-gray-700">✅ พร้อมขาย</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-burger-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  {editingProduct ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มสินค้า'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminNav>
  );
}
