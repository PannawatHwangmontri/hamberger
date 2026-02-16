'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getRecommendedProducts, createOrder } from '@/lib/api';

export default function UserPage() {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [productsRes, recommendedRes] = await Promise.all([
        getProducts(),
        getRecommendedProducts()
      ]);
      setProducts(productsRes.data);
      setRecommendedProducts(recommendedRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleOrder = async () => {
    if (!tableNumber) {
      alert('กรุณากรอกหมายเลขโต๊ะ');
      return;
    }
    if (cart.length === 0) {
      alert('กรุณาเลือกสินค้า');
      return;
    }

    try {
      const orderData = {
        table_number: parseInt(tableNumber),
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      const response = await createOrder(orderData);
      setOrderId(response.data.order_id);
      setOrderSuccess(true);
      setCart([]);
      setShowCart(false);
      setTableNumber('');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '🍽️' },
    { id: 'burger', name: 'เบอร์เกอร์', icon: '🍔' },
    { id: 'side', name: 'เครื่องเคียง', icon: '🍟' },
    { id: 'drink', name: 'เครื่องดื่ม', icon: '🥤' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-4xl animate-bounce">🍔 กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b-4 border-burger-yellow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-5xl group-hover:rotate-12 transition-transform duration-300">🍔</span>
              <h1 className="text-4xl font-display font-bold text-burger-dark">Burger House</h1>
            </Link>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-burger-red text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🛒 ตะกร้า
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-burger-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {orderSuccess && (
        <div className="bg-green-500 text-white p-6 text-center animate-slide-up">
          <p className="text-2xl font-bold mb-2">✅ สั่งซื้อสำเร็จ!</p>
          <p className="mb-4">หมายเลขออเดอร์: #{orderId}</p>
          <Link
            href={`/user/order/${orderId}`}
            className="inline-block bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-green-50 transition-colors"
          >
            ดูสถานะออเดอร์ →
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="mb-12 animate-slide-up">
            <h2 className="text-4xl font-display font-bold text-burger-dark mb-6 flex items-center">
              ⭐ เมนูแนะนำ
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-burger-yellow"
                >
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-burger-dark mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-burger-red">฿{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-burger-yellow text-white px-6 py-3 rounded-full font-bold hover:bg-burger-red transform hover:scale-105 transition-all duration-300 shadow-md"
                      >
                        เพิ่ม +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2 animate-fade-in">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-burger-red text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* All Products */}
        <section className="animate-slide-up">
          <h2 className="text-4xl font-display font-bold text-burger-dark mb-6">
            🍽️ เมนูทั้งหมด
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-40 bg-gray-200">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-burger-dark mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-burger-red">฿{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-burger-yellow text-white px-4 py-2 rounded-full font-bold hover:bg-burger-red transition-colors shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl p-6 overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-display font-bold text-burger-dark">🛒 ตะกร้า</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-6xl mb-4">🍔</p>
                <p className="text-xl">ตะกร้าว่างเปล่า</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-bold text-burger-dark">{item.name}</h3>
                        <p className="text-burger-red font-bold">฿{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 bg-burger-yellow text-white rounded-full hover:bg-burger-red font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>รวมทั้งหมด:</span>
                    <span className="text-burger-red">฿{getTotalPrice()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 text-gray-700">หมายเลขโต๊ะ</label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="กรอกหมายเลขโต๊ะ"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-burger-yellow focus:outline-none text-lg"
                  />
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-burger-yellow to-burger-red text-white py-4 rounded-full font-bold text-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  สั่งซื้อเลย! 🎉
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
