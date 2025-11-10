'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper function to get system theme
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Helper function to get stored theme
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  
  try {
    return (localStorage.getItem('theme') as Theme) || 'system'
  } catch {
    return 'system'
  }
}

// Helper function to set theme class on document
const applyTheme = (theme: Theme) => {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  
  // Remove existing theme classes
  document.documentElement.classList.remove('light', 'dark')
  // Add new theme class
  document.documentElement.classList.add(resolved)
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    const color = resolved === 'dark' ? '#0f172a' : '#ffffff'
    metaThemeColor.setAttribute('content', color)
  }
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme()
    setThemeState(storedTheme)
    setMounted(true)
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return

    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyTheme(theme)

    // Store theme preference
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme, mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme('system')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Higher-order component for theme-aware styling
export function withTheme<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ThemedComponent(props: P) {
    const { resolvedTheme } = useTheme()
    
    return <Component {...props} data-theme={resolvedTheme} />
  }
}

// Custom hook for theme-specific values
export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? darkValue : lightValue
}

// Hook for responsive theme adjustments
export function useThemeClass(lightClass: string, darkClass: string): string {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? darkClass : lightClass
}