import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cairo"
});

export const metadata: Metadata = {
  title: 'MO CONTROL | BLACK GOLD - VIP Services',
  description: 'التفعيل أولاً والدفع لاحقاً - أسرع خدمة تفعيل باقات في مصر',
  generator: 'v0.app',
  icons: {
    icon: 'https://i.top4top.io/p_3751ryoix1.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-black">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased bg-black text-white`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
