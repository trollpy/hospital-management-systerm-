'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

// App state types
interface AppState {
  isLoading: boolean
  isOnline: boolean
  sidebarOpen: boolean
  notifications: Notification[]
  modals: {
    [key: string]: boolean
  }
  currentPatient: any | null
  currentVisit: any | null
  searchQuery: string
  filters: {
    department: string
    status: string
    dateRange: {
      start: string
      end: string
    }
  }
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'OPEN_MODAL'; payload: string }
  | { type: 'CLOSE_MODAL'; payload: string }
  | { type: 'SET_CURRENT_PATIENT'; payload: any }
  | { type: 'SET_CURRENT_VISIT'; payload: any }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'RESET_FILTERS' }

// Initial state
const initialState: AppState = {
  isLoading: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  sidebarOpen: false,
  notifications: [],
  modals: {},
  currentPatient: null,
  currentVisit: null,
  searchQuery: '',
  filters: {
    department: '',
    status: '',
    dateRange: {
      start: '',
      end: '',
    },
  },
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload }
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload }
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      }
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      }
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      }
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: true },
      }
    
    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: false },
      }
    
    case 'SET_CURRENT_PATIENT':
      return { ...state, currentPatient: action.payload }
    
    case 'SET_CURRENT_VISIT':
      return { ...state, currentVisit: action.payload }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }
    
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }
    
    default:
      return state
  }
}

// Context interface
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper methods
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  showError: (message: string, title?: string) => void
  showSuccess: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
  openModal: (modalName: string) => void
  closeModal: (modalName: string) => void
  isModalOpen: (modalName: string) => boolean
  setLoading: (loading: boolean) => void
  setCurrentPatient: (patient: any) => void
  setCurrentVisit: (visit: any) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<AppState['filters']>) => void
  resetFilters: () => void
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  // Helper methods
  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
  }

  const showError = (message: string, title: string = 'Error') => {
    showNotification({ type: 'error', title, message })
  }

  const showSuccess = (message: string, title: string = 'Success') => {
    showNotification({ type: 'success', title, message })
  }

  const showWarning = (message: string, title: string = 'Warning') => {
    showNotification({ type: 'warning', title, message })
  }

  const openModal = (modalName: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: modalName })
  }

  const closeModal = (modalName: string) => {
    dispatch({ type: 'CLOSE_MODAL', payload: modalName })
  }

  const isModalOpen = (modalName: string): boolean => {
    return state.modals[modalName] || false
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setCurrentPatient = (patient: any) => {
    dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient })
  }

  const setCurrentVisit = (visit: any) => {
    dispatch({ type: 'SET_CURRENT_VISIT', payload: visit })
  }

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }

  const setFilters = (filters: Partial<AppState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' })
  }

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_ONLINE', payload: true })
      showSuccess('Connection restored', 'You are back online')
    }

    const handleOffline = () => {
      dispatch({ type: 'SET_ONLINE', payload: false })
      showWarning('Connection lost', 'You are currently offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const expiredNotifications = state.notifications
        .filter(notification => !notification.read && now - notification.timestamp > 5000)
        .map(notification => notification.id)

      expiredNotifications.forEach(id => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.notifications])

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    if (state.sidebarOpen) {
      dispatch({ type: 'SET_SIDEBAR', payload: false })
    }
  }, []) // Add dependency for route changes if using Next.js router

  const contextValue: AppContextType = {
    state,
    dispatch,
    showNotification,
    showError,
    showSuccess,
    showWarning,
    openModal,
    closeModal,
    isModalOpen,
    setLoading,
    setCurrentPatient,
    setCurrentVisit,
    setSearchQuery,
    setFilters,
    resetFilters,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use the app context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}