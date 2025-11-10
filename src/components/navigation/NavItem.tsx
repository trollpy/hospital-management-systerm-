'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  description?: string
  badge?: string | number
  onClick?: () => void
}

export function NavItem({ 
  href, 
  icon, 
  label, 
  description, 
  badge, 
  onClick 
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <a
      href={href}
      onClick={onClick}
      className={clsx(
        'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
        isActive
          ? 'bg-blue-500/10 text-blue-600 border-r-2 border-blue-500 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {/* Animated background */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transition-transform duration-300',
        isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'
      )} />
      
      {/* Icon */}
      <div className={clsx(
        'relative z-10 transition-colors duration-200',
        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
      )}>
        {icon}
      </div>
      
      {/* Text content */}
      <div className="relative z-10 ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium">{label}</span>
          {badge && (
            <span className={clsx(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
            )}>
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className={clsx(
            'text-xs truncate transition-colors duration-200',
            isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-600'
          )}>
            {description}
          </p>
        )}
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}
    </a>
  )
}