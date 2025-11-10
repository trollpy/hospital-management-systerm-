'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  outlined: 'border border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl transition-all duration-200',
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card'