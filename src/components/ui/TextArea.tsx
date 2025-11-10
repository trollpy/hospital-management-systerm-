'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'block w-full rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-3 px-4 text-base transition-all duration-200 resize-vertical min-h-[80px]',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={clsx(
            'mt-1 text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea'