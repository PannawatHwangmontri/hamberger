import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "🍔 Hamberger",
  description: "ระบบสั่งอาหารร้านแฮมเบอร์เกอร์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
