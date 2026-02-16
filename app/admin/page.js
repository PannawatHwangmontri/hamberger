'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin({ username, password });
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_username', response.data.username);
      router.push('/admin/orders');
    } catch (error) {
      console.error('Login error:', error);
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-amber-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 font-semibold"
        >
          ← กลับหน้าหลัก
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-burger-red animate-slide-up">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">👨‍💼</div>
            <h1 className="text-4xl font-display font-bold text-burger-dark mb-2">เข้าสู่ระบบ</h1>
            <p className="text-gray-600">สำหรับแอดมิน</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg animate-bounce">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-burger-red focus:outline-none text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-burger-red to-red-700 text-white py-4 rounded-full font-bold text-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ กำลังเข้าสู่ระบบ...' : '🔐 เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>ข้อมูล Default: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
