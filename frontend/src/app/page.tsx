import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="text-7xl mb-4">🍔</div>
        <h1 className="text-5xl font-extrabold text-amber-800 mb-3">Hamberger</h1>
        <p className="text-gray-500 text-lg">เลือกประเภทการใช้งาน</p>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <Link href="/user" className="flex-1">
          <div className="card p-8 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-2 border-transparent hover:border-amber-300">
            <div className="text-5xl mb-4">🙋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-amber-600">ผู้ใช้ทั่วไป</h2>
            <p className="text-sm text-gray-400">ดูเมนู สั่งอาหาร ตรวจสอบออเดอร์</p>
          </div>
        </Link>

        <Link href="/admin/login" className="flex-1">
          <div className="card p-8 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-2 border-transparent hover:border-amber-300">
            <div className="text-5xl mb-4">👨‍💼</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-amber-600">แอดมิน</h2>
            <p className="text-sm text-gray-400">จัดการสินค้าและออเดอร์</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
