'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminNav({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_username');
    
    if (!token && pathname !== '/admin') {
      router.push('/admin');
    } else {
      setUsername(user || 'Admin');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    router.push('/admin');
  };

  if (pathname === '/admin') {
    return children;
  }

  const navItems = [
    { href: '/admin/orders', label: '📋 ออเดอร์', icon: '📋' },
    { href: '/admin/products', label: '🍔 สินค้า', icon: '🍔' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-burger-red sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/admin/orders" className="flex items-center space-x-3 group">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">👨‍💼</span>
              <div>
                <h1 className="text-2xl font-display font-bold text-burger-dark">Admin Panel</h1>
                <p className="text-sm text-gray-600">Burger House Management</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-700">สวัสดี, <span className="font-bold">{username}</span></span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 pb-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 rounded-t-lg font-bold transition-all duration-300 ${
                  pathname.startsWith(item.href)
                    ? 'bg-burger-red text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
