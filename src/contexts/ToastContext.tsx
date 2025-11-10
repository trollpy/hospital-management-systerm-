'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Toast } from '@/components/ui/Toast'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_TOAST'; payload: { id: string; updates: Partial<Toast> } }
  | { type: 'DISMISS_TOAST'; payload: string }

// Initial state
const initialState: ToastState = {
  toasts: [],
}

// Reducer
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      const newToast: Toast = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
      }
      return {
        ...state,
        toasts: [newToast, ...state.toasts].slice(0, 5), // Limit to 5 toasts
      }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.payload.id
            ? { ...toast, ...action.payload.updates }
            : toast
        ),
      }

    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.payload.id
            ? { ...toast, duration: 0 } // Immediately remove
            : toast
        ),
      }

    default:
      return state
  }
}

// Context type
interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<Toast>) => void
  dismissToast: (id: string) => void
  // Convenience methods
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider component
interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const addToast = (toast: Omit<Toast, 'id'>) => {
    dispatch({ type: 'ADD_TOAST', payload: toast })
  }

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }

  const updateToast = (id: string, updates: Partial<Toast>) => {
    dispatch({ type: 'UPDATE_TOAST', payload: { id, updates } })
  }

  const dismissToast = (id: string) => {
    dispatch({ type: 'DISMISS_TOAST', payload: id })
  }

  // Convenience methods
  const success = (title: string, message?: string) => {
    addToast({
      type: 'success',
      title,
      message,
      duration: 5000,
    })
  }

  const error = (title: string, message?: string) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000,
    })
  }

  const warning = (title: string, message?: string) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
    })
  }

  const info = (title: string, message?: string) => {
    addToast({
      type: 'info',
      title,
      message,
      duration: 4000,
    })
  }

  const contextValue: ToastContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    updateToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Toast container component
function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)!

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          action={toast.action}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Higher-order component for toast functionality
export function withToast<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ToastedComponent(props: P) {
    const toast = useToast()
    
    return <Component {...props} toast={toast} />
  }
}