'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { clsx } from 'clsx'

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(path => path)
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard', current: paths.length === 0 }
    ]
    
    let accumulatedPath = ''
    paths.forEach((path, index) => {
      accumulatedPath += `/${path}`
      
      // Convert path to readable label
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        label,
        href: accumulatedPath,
        current: index === paths.length - 1
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              )}
              <a
                href={breadcrumb.href}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  breadcrumb.current
                    ? 'text-gray-500 cursor-default'
                    : 'text-gray-700 hover:text-gray-900'
                )}
                aria-current={breadcrumb.current ? 'page' : undefined}
              >
                {index === 0 ? (
                  <Home className="w-4 h-4" />
                ) : (
                  breadcrumb.label
                )}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}