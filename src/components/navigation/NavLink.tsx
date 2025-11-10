'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'text-blue-600 bg-blue-50 border-blue-200',
  inactiveClassName = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  exact = false
}: NavLinkProps) {
  const pathname = usePathname()
  
  const isActive = exact 
    ? pathname === href
    : pathname.startsWith(href)

  return (
    <a
      href={href}
      className={clsx(
        'flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200',
        isActive ? activeClassName : inactiveClassName,
        className
      )}
    >
      {children}
    </a>
  )
}