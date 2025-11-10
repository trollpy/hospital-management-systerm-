'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useConvexMutation, useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../convex/_generated/api'
import { UserRole } from '@/config/setting'

// Extended user type with app-specific data
interface AppUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department: string
  isActive: boolean
  permissions: string[]
  lastLogin?: string
}

interface AuthState {
  user: AppUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canAccess: (resource: string, action: string) => boolean
  updateProfile: (data: Partial<AppUser>) => Promise<void>
  refreshUser: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { signOut } = useClerk()
  
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isInitialized: false,
  })

  // Convex mutations and queries
  const { mutate: syncUser } = useConvexMutation(api.auth.syncUser)
  const { data: staffData } = useConvexQuery(api.staff.list, {
    role: undefined,
    department: undefined,
  })

  // Sync user with Convex when authenticated
  useEffect(() => {
    const syncUserData = async () => {
      if (clerkUser && clerkLoaded) {
        try {
          // Sync user with Convex database
          await syncUser({})
          
          // Find staff record for this user
          const staffRecord = staffData?.find(
            (staff: any) => staff.userId === clerkUser.id
          )

          if (staffRecord) {
            const appUser: AppUser = {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              firstName: staffRecord.firstName,
              lastName: staffRecord.lastName,
              role: staffRecord.role as UserRole,
              department: staffRecord.department,
              isActive: staffRecord.isActive,
              permissions: [], // Will be populated based on role
              lastLogin: new Date().toISOString(),
            }

            setState({
              user: appUser,
              isLoading: false,
              isAuthenticated: true,
              isInitialized: true,
            })
          } else {
            // Staff record not found
            setState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              isInitialized: true,
            })
          }
        } catch (error) {
          console.error('Error syncing user:', error)
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isInitialized: true,
          })
        }
      } else if (clerkLoaded && !clerkUser) {
        // No authenticated user
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isInitialized: true,
        })
      }
    }

    syncUserData()
  }, [clerkUser, clerkLoaded, syncUser, staffData])

  // Auth methods
  const login = async (email: string, password: string): Promise<void> => {
    // Clerk handles authentication, this is for custom auth if needed
    throw new Error('Use Clerk authentication components for login')
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut()
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isInitialized: true,
      })
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false
    // Implement permission check based on user role
    // This would integrate with your RBAC system
    return state.user.permissions.includes(permission) || state.user.role === 'super-admin'
  }

  const canAccess = (resource: string, action: string): boolean => {
    const permission = `${resource}:${action}`
    return hasPermission(permission) || hasPermission('*')
  }

  const updateProfile = async (data: Partial<AppUser>): Promise<void> => {
    if (!state.user) {
      throw new Error('No user authenticated')
    }

    try {
      // Update user profile in Convex
      // This would call a Convex mutation to update the staff record
      console.log('Updating profile:', data)
      // Implement actual update logic
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const refreshUser = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Force re-sync of user data
    if (clerkUser) {
      try {
        await syncUser({})
        // The useEffect will handle the rest
      } catch (error) {
        console.error('Error refreshing user:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    hasPermission,
    canAccess,
    updateProfile,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string
): React.FC<P> {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, hasPermission, isLoading } = useAuthContext()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // Redirect to login or show access denied
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      )
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Permission Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Hook for checking permissions in components
export function usePermission() {
  const { hasPermission, canAccess } = useAuthContext()
  
  return {
    hasPermission,
    canAccess,
  }
}