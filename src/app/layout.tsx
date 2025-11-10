import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hospital Management System',
  description: 'Comprehensive hospital management solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}