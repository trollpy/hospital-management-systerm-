'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

interface NavGroupProps {
  title: string
  icon: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

export function NavGroup({ title, icon, children, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-500 group-hover:text-gray-700 transition-colors">
            {icon}
          </div>
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      <div className={clsx(
        'space-y-1 overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        {children}
      </div>
    </div>
  )
}