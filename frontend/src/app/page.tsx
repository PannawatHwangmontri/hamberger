import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-peach-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-peach-200/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-peach-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <div className="text-center mb-14 animate-slide-up relative z-10">
        <div className="text-8xl mb-5 animate-float drop-shadow-lg">🍔</div>
        <h1 className="text-6xl font-black mb-3 bg-gradient-to-br from-peach-700 via-peach-600 to-peach-500 bg-clip-text text-transparent leading-tight">
          Hamberger
        </h1>
        <p className="text-peach-600/80 text-lg font-semibold tracking-wide">
          เลือกประเภทการใช้งาน
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg relative z-10">
        <Link href="/user" className="flex-1">
          <div className="glass-card p-8 text-center cursor-pointer hover:shadow-peach-lg hover:-translate-y-2 transition-all duration-300 group border-2 border-transparent hover:border-peach-300">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">🙋</div>
            <h2 className="text-xl font-black text-peach-800 mb-1 group-hover:text-peach-600">
              ผู้ใช้ทั่วไป
            </h2>
            <p className="text-sm text-peach-500/80 font-medium">ดูเมนู สั่งอาหาร ตรวจสอบออเดอร์</p>
          </div>
        </Link>

        <Link href="/admin/login" className="flex-1">
          <div className="glass-card p-8 text-center cursor-pointer hover:shadow-peach-lg hover:-translate-y-2 transition-all duration-300 group border-2 border-transparent hover:border-peach-300">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">👨‍💼</div>
            <h2 className="text-xl font-black text-peach-800 mb-1 group-hover:text-peach-600">
              แอดมิน
            </h2>
            <p className="text-sm text-peach-500/80 font-medium">จัดการสินค้าและออเดอร์</p>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-16 text-peach-400 text-sm font-medium relative z-10">
        🍅 Hamberger Restaurant System
      </p>
    </main>
  );
}
