'use client'

import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Pill,
  FlaskRound,
  DollarSign,
  Settings,
  Stethoscope,
  Baby,
  Heart,
  X
} from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Overview and analytics'
  },
  { 
    name: 'Patients', 
    href: '/patients', 
    icon: Users,
    description: 'Patient management'
  },
  { 
    name: 'Appointments', 
    href: '/appointments', 
    icon: Calendar,
    description: 'Schedule and manage'
  },
  { 
    name: 'Visits', 
    href: '/visits', 
    icon: FileText,
    description: 'Patient consultations'
  },
  { 
    name: 'ANC', 
    href: '/anc', 
    icon: Baby,
    description: 'Antenatal care'
  },
  { 
    name: 'Family Planning', 
    href: '/family-planning', 
    icon: Heart,
    description: 'Reproductive health'
  },
  { 
    name: 'Pharmacy', 
    href: '/pharmacy', 
    icon: Pill,
    description: 'Medication management'
  },
  { 
    name: 'Laboratory', 
    href: '/lab', 
    icon: FlaskRound,
    description: 'Tests and results'
  },
  { 
    name: 'Billing', 
    href: '/billing', 
    icon: DollarSign,
    description: 'Invoices and payments'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'System configuration'
  },
]

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">Hospital HMS</span>
            <p className="text-xs text-gray-400">Healthcare Management</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-400 shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              )}
              onClick={onClose}
            >
              {/* Animated background */}
              <div className={clsx(
                'absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 transition-transform duration-300',
                isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'
              )} />
              
              <Icon className={clsx(
                'w-5 h-5 relative z-10 transition-colors',
                isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
              )} />
              
              <div className="ml-3 relative z-10 flex-1">
                <span className="block">{item.name}</span>
                <span className={clsx(
                  'text-xs transition-all duration-200',
                  isActive ? 'text-blue-300' : 'text-gray-500 group-hover:text-gray-300'
                )}>
                  {item.description}
                </span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              )}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            All systems operational
          </p>
        </div>
      </div>
    </div>
  )
}