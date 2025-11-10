'use client'

import { AppProps } from 'next/app'
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ConvexClientProvider>
  )
}