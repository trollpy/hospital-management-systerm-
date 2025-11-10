'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableProps {
  children: ReactNode
  className?: string
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

interface TableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

interface TableCellProps {
  children: ReactNode
  className?: string
  colSpan?: number
  align?: 'left' | 'center' | 'right'
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
      <table className={clsx('w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={clsx('bg-gray-50', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, onClick, hover = true }: TableRowProps) {
  return (
    <tr
      className={clsx(
        'transition-colors duration-150',
        hover && 'hover:bg-gray-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export function TableCell({ children, className, colSpan, align = 'left' }: TableCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={clsx(
        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
        `text-${align}`,
        className
      )}
    >
      {children}
    </td>
  )
}

export function TableHead({ children, className, align = 'left' }: TableCellProps) {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        `text-${align}`,
        className
      )}
    >
      {children}
    </th>
  )
}