'use client';

import { useEffect, useState } from 'react';
import AdminNav from '@/components/AdminNav';
import { adminGetOrders, adminGetOrder, adminUpdateOrderStatus, adminDeleteOrder } from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await adminGetOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId) => {
    try {
      const response = await adminGetOrder(orderId);
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('ไม่สามารถโหลดรายละเอียดออเดอร์ได้');
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        await loadOrderDetails(orderId);
      }
      alert('อัปเดตสถานะสำเร็จ');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('คุณต้องการลบออเดอร์นี้หรือไม่?')) return;

    try {
      await adminDeleteOrder(orderId);
      await loadOrders();
      setShowDetails(false);
      alert('ลบออเดอร์สำเร็จ');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('ไม่สามารถลบออเดอร์ได้');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'รอดำเนินการ' },
      preparing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'กำลังทำ' },
      ready: { bg: 'bg-green-100', text: 'text-green-800', label: 'พร้อมเสิร์ฟ' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'เสร็จสิ้น' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ยกเลิก' },
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-bold`}>
        {style.label}
      </span>
    );
  };

  const statuses = [
    { value: 'pending', label: '⏳ รอดำเนินการ' },
    { value: 'preparing', label: '👨‍🍳 กำลังทำ' },
    { value: 'ready', label: '✅ พร้อมเสิร์ฟ' },
    { value: 'completed', label: '🎉 เสร็จสิ้น' },
    { value: 'cancelled', label: '❌ ยกเลิก' },
  ];

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
          <h2 className="text-3xl font-display font-bold text-burger-dark">📋 จัดการออเดอร์</h2>
          <p className="text-gray-600 mt-1">ออเดอร์ทั้งหมด: {orders.length} รายการ</p>
        </div>
        <button
          onClick={loadOrders}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
        >
          🔄 รีเฟรช
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-xl text-gray-600">ยังไม่มีออเดอร์</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">โต๊ะ</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">จำนวนรายการ</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">ราคารวม</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">สถานะ</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">เวลา</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-burger-dark">#{order.id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-burger-yellow text-white px-3 py-1 rounded-full font-bold">
                        โต๊ะ {order.table_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.item_count} รายการ</td>
                    <td className="px-6 py-4 font-bold text-burger-red">฿{order.total_price}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => loadOrderDetails(order.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded font-bold hover:bg-blue-600 transition-colors text-sm"
                        >
                          📋 รายละเอียด
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-burger-red text-white p-6 flex justify-between items-center sticky top-0">
              <h3 className="text-2xl font-bold">รายละเอียดออเดอร์ #{selectedOrder.id}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:text-gray-200 text-3xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">โต๊ะ</p>
                  <p className="text-2xl font-bold text-burger-dark">{selectedOrder.table_number}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">ยอดรวม</p>
                  <p className="text-2xl font-bold text-burger-red">฿{selectedOrder.total_price}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-burger-dark">รายการอาหาร</h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-bold">{item.product_name}</p>
                        <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-burger-red">฿{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-burger-dark">อัปเดตสถานะ</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => updateStatus(selectedOrder.id, status.value)}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        selectedOrder.status === status.value
                          ? 'bg-burger-red text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="text-gray-600">สร้างเมื่อ: {new Date(selectedOrder.created_at).toLocaleString('th-TH')}</p>
                <p className="text-gray-600">อัปเดตล่าสุด: {new Date(selectedOrder.updated_at).toLocaleString('th-TH')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-gray-500 mt-6 text-sm">
        ⏱️ หน้านี้จะรีเฟรชอัตโนมัติทุก 10 วินาที
      </p>
    </AdminNav>
  );
}
