'use client'

import { useUser } from '@clerk/clerk-react'
import { UserRole } from '@/config/setting'

// Extended user type for the application
interface AppUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department: string
  isActive: boolean
  fullName: string
  initials: string
}

/**
 * Custom hook for authentication and user management
 * Extends Clerk's useUser with application-specific functionality
 */
export function useAuth() {
  const { 
    user: clerkUser, 
    isLoaded: clerkLoaded, 
    isSignedIn 
  } = useUser()

  // Transform Clerk user to app user
  const user: AppUser | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    role: (clerkUser.publicMetadata?.role as UserRole) || 'reception',
    department: (clerkUser.publicMetadata?.department as string) || 'General Medicine',
    isActive: true,
    fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
    initials: `${clerkUser.firstName?.[0] || ''}${clerkUser.lastName?.[0] || ''}`.toUpperCase(),
  } : null

  // Check if user has specific role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }

  // Check if user is in specific department
  const inDepartment = (department: string | string[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(department)) {
      return department.includes(user.department)
    }
    
    return user.department === department
  }

  // Check if user can perform action (basic permission check)
  const can = (action: string, resource?: string): boolean => {
    if (!user) return false
    
    // Super admin can do everything
    if (user.role === 'super-admin') return true
    
    // Basic permission checks based on role
    const permissions = {
      'admin': ['read', 'write', 'delete', 'manage'],
      'clinician': ['read', 'write'],
      'nurse': ['read', 'write'],
      'pharmacist': ['read', 'write'],
      'lab-tech': ['read', 'write'],
      'accountant': ['read', 'write'],
      'reception': ['read', 'write'],
    }
    
    const rolePermissions = permissions[user.role] || []
    return rolePermissions.includes(action)
  }

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    if (!user) return false
    
    const routePermissions: Record<string, UserRole[]> = {
      '/dashboard': ['super-admin', 'admin', 'clinician', 'nurse', 'pharmacist', 'lab-tech', 'accountant', 'reception'],
      '/patients': ['super-admin', 'admin', 'clinician', 'nurse', 'reception'],
      '/appointments': ['super-admin', 'admin', 'clinician', 'nurse', 'reception'],
      '/visits': ['super-admin', 'admin', 'clinician', 'nurse'],
      '/anc': ['super-admin', 'admin', 'clinician', 'nurse'],
      '/family-planning': ['super-admin', 'admin', 'clinician', 'nurse'],
      '/pharmacy': ['super-admin', 'admin', 'pharmacist'],
      '/lab': ['super-admin', 'admin', 'lab-tech', 'clinician'],
      '/billing': ['super-admin', 'admin', 'accountant'],
      '/reports': ['super-admin', 'admin', 'accountant'],
      '/settings': ['super-admin', 'admin'],
    }
    
    const allowedRoles = routePermissions[route] || []
    return allowedRoles.includes(user.role)
  }

  return {
    // Clerk properties
    user,
    isLoading: !clerkLoaded,
    isAuthenticated: isSignedIn,
    
    // Application-specific properties
    role: user?.role,
    department: user?.department,
    isAdmin: hasRole(['super-admin', 'admin']),
    isClinician: hasRole(['clinician']),
    isStaff: hasRole(['clinician', 'nurse', 'pharmacist', 'lab-tech']),
    
    // Methods
    hasRole,
    inDepartment,
    can,
    canAccessRoute,
  }
}

/**
 * Hook for protecting components based on authentication
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
  }
}

/**
 * Hook for role-based component protection
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, isLoading, hasRole } = useAuth()
  
  const hasRequiredRole = user ? hasRole(requiredRole) : false
  const isAuthorized = !isLoading && hasRequiredRole
  
  return {
    isAuthorized,
    isLoading,
    hasRequiredRole,
    user,
  }
}

/**
 * Hook for department-based component protection
 */
export function useRequireDepartment(requiredDepartment: string | string[]) {
  const { user, isLoading, inDepartment } = useAuth()
  
  const inRequiredDepartment = user ? inDepartment(requiredDepartment) : false
  const isAuthorized = !isLoading && inRequiredDepartment
  
  return {
    isAuthorized,
    isLoading,
    inRequiredDepartment,
    user,
  }
}