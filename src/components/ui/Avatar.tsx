'use client'

import { clsx } from 'clsx'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  initials?: string
  className?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
}

const statusSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5'
}

const statusColorClasses = {
  online: 'bg-green-400',
  offline: 'bg-gray-400',
  busy: 'bg-red-400',
  away: 'bg-yellow-400'
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  initials, 
  className,
  status 
}: AvatarProps) {
  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx(
            'rounded-full object-cover bg-gray-200',
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold',
            sizeClasses[size],
            className
          )}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusSizeClasses[size],
            statusColorClasses[status]
          )}
        />
      )}
    </div>
  )
}