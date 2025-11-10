'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '../ui/Spinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="relative flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold">Hospital HMS</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Comprehensive Healthcare Management
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Streamline your hospital operations with our all-in-one management system. 
                From patient care to administrative tasks, we've got you covered.
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Patient Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Electronic Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
          
          <div className="text-blue-100">
            <p>Trusted by healthcare professionals worldwide</p>
          </div>
        </div>

        {/* Right Panel - Auth Content */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">Hospital HMS</span>
                  <p className="text-sm text-gray-600">Healthcare Management</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
              {children}
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Secure • Reliable • HIPAA Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}