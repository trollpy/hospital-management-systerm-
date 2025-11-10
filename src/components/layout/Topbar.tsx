'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '../ui/Button'
import { Bell, Search, Calendar, Activity } from 'lucide-react'

export function Topbar() {
  const { user } = useAuth()

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Stats */}
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. {user?.lastName}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">24 Patients Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">8 Appointments</span>
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                placeholder="Search patients, records..."
              />
            </div>

            {/* Notifications */}
            <Button variant="secondary" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.publicMetadata?.role as string || 'user'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Search patients, records..."
            />
          </div>
        </div>
      </div>
    </header>
  )
}