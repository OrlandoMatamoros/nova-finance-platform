import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nova Finance Platform',
  description: 'Dashboard financiero multi-tenant con IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
