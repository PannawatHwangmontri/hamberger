'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '@/lib/api';

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadOrder, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  const loadOrder = async () => {
    try {
      const response = await getOrder(params.id);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading order:', error);
      setError('ไม่พบออเดอร์นี้');
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { icon: '⏳', text: 'รอดำเนินการ', color: 'bg-yellow-500', description: 'ออเดอร์ของคุณอยู่ในคิว' },
      preparing: { icon: '👨‍🍳', text: 'กำลังทำอาหาร', color: 'bg-blue-500', description: 'เชฟกำลังทำอาหารของคุณ' },
      ready: { icon: '✅', text: 'พร้อมเสิร์ฟ', color: 'bg-green-500', description: 'อาหารพร้อมแล้ว!' },
      completed: { icon: '🎉', text: 'เสร็จสิ้น', color: 'bg-gray-500', description: 'เสิร์ฟเรียบร้อย' },
      cancelled: { icon: '❌', text: 'ยกเลิก', color: 'bg-red-500', description: 'ออเดอร์ถูกยกเลิก' },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-4xl animate-bounce">🍔 กำลังโหลด...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-2xl text-gray-700 mb-6">{error}</p>
          <Link
            href="/user"
            className="inline-block bg-burger-red text-white px-6 py-3 rounded-full font-bold hover:bg-red-700"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-burger-yellow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/user" className="flex items-center space-x-3 group w-fit">
            <span className="text-5xl group-hover:rotate-12 transition-transform duration-300">🍔</span>
            <h1 className="text-4xl font-display font-bold text-burger-dark">Burger House</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Status Header */}
          <div className={`${statusInfo.color} text-white p-8 text-center`}>
            <div className="text-8xl mb-4 animate-bounce">{statusInfo.icon}</div>
            <h2 className="text-4xl font-display font-bold mb-2">{statusInfo.text}</h2>
            <p className="text-xl opacity-90">{statusInfo.description}</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-amber-50 p-6 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">หมายเลขออเดอร์</p>
                <p className="text-3xl font-bold text-burger-dark">#{order.id}</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">หมายเลขโต๊ะ</p>
                <p className="text-3xl font-bold text-burger-red">โต๊ะ {order.table_number}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold text-burger-dark mb-4">รายการอาหาร</h3>
              <div className="space-y-3">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-bold text-burger-dark">{item.product_name}</p>
                      <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                    </div>
                    <p className="text-xl font-bold text-burger-red">฿{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-700">ยอดรวม:</span>
                <span className="text-4xl font-bold text-burger-red">฿{order.total_price}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-amber-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">เวลาสั่งซื้อ</p>
              <p className="text-lg font-semibold">{new Date(order.created_at).toLocaleString('th-TH')}</p>
              {order.updated_at !== order.created_at && (
                <>
                  <p className="text-sm text-gray-600 mb-2 mt-4">อัปเดตล่าสุด</p>
                  <p className="text-lg font-semibold">{new Date(order.updated_at).toLocaleString('th-TH')}</p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/user"
                className="flex-1 bg-burger-yellow text-white py-4 rounded-full font-bold text-center hover:bg-burger-red transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                สั่งเพิ่ม 🍔
              </Link>
              <button
                onClick={loadOrder}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                🔄 รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Auto Refresh Notice */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          ⏱️ หน้านี้จะอัปเดตสถานะอัตโนมัติทุก 5 วินาที
        </p>
      </main>
    </div>
  );
}
