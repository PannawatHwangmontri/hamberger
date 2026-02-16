'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-7xl font-display font-bold text-burger-dark mb-4 drop-shadow-lg">
            🍔 Burger House
          </h1>
          <p className="text-2xl text-gray-700 font-light tracking-wide">
            ยินดีต้อนรับสู่ร้านแฮมเบอร์เกอร์ที่ดีที่สุด
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* User Card */}
          <Link href="/user" className="group">
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-4 border-amber-200 hover:border-burger-yellow animate-bounce-in">
              <div className="text-center">
                <div className="text-8xl mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  👤
                </div>
                <h2 className="text-4xl font-display font-bold text-burger-dark mb-4">
                  ผู้ใช้ทั่วไป
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  สั่งอาหาร ดูเมนู และติดตามออเดอร์
                </p>
                <div className="bg-gradient-to-r from-burger-yellow to-burger-red text-white px-8 py-4 rounded-full font-bold text-xl group-hover:shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                  เข้าสู่ระบบ →
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link href="/admin" className="group">
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-4 border-red-200 hover:border-burger-red animate-bounce-in" style={{animationDelay: '0.1s'}}>
              <div className="text-center">
                <div className="text-8xl mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  👨‍💼
                </div>
                <h2 className="text-4xl font-display font-bold text-burger-dark mb-4">
                  แอดมิน
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  จัดการสินค้า ออเดอร์ และระบบ
                </p>
                <div className="bg-gradient-to-r from-burger-red to-red-700 text-white px-8 py-4 rounded-full font-bold text-xl group-hover:shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                  เข้าสู่ระบบ →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 text-center text-gray-500 text-sm animate-fade-in" style={{animationDelay: '0.3s'}}>
          <p>Made with ❤️ for burger lovers</p>
        </div>
      </div>
    </main>
  );
}
