'use client'

import { useState } from 'react'
import { SignIn } from '@clerk/nextjs'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, Eye, EyeOff, Stethoscope } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = (role: string) => {
    setIsLoading(true)
    // Demo login functionality - in real app, this would be handled by Clerk
    console.log(`Demo login as ${role}`)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your Hospital HMS account</p>
      </div>

      {/* Clerk SignIn Component */}
      <div className="mb-6">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0 p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlock: "space-y-3",
              socialButtons: "space-y-3",
              formButtonPrimary: 
                "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl",
              formFieldInput:
                "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
              footer: "hidden"
            }
          }}
        />
      </div>

      {/* Demo Access Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">
          Quick Demo Access
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDemoLogin('doctor')}
            isLoading={isLoading}
            className="text-xs"
          >
            👨‍⚕️ Doctor
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDemoLogin('nurse')}
            isLoading={isLoading}
            className="text-xs"
          >
            👩‍⚕️ Nurse
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDemoLogin('reception')}
            isLoading={isLoading}
            className="text-xs"
          >
            💼 Reception
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            isLoading={isLoading}
            className="text-xs"
          >
            ⚙️ Admin
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Demo accounts show different role-based interfaces
        </p>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 text-sm">🔒</span>
          </div>
          <p className="text-xs text-gray-600">Secure</p>
        </div>
        <div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 text-sm">⚡</span>
          </div>
          <p className="text-xs text-gray-600">Fast</p>
        </div>
        <div>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 text-sm">🏥</span>
          </div>
          <p className="text-xs text-gray-600">HIPAA Ready</p>
        </div>
      </div>
    </AuthLayout>
  )
}