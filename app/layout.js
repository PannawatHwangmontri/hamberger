import './globals.css'

export const metadata = {
  title: 'Burger House - ร้านแฮมเบอร์เกอร์',
  description: 'ร้านแฮมเบอร์เกอร์คุณภาพ รสชาติเยี่ยม',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
