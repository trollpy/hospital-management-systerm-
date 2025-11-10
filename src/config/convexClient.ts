import { ConvexReactClient } from 'convex/react'

// Initialize Convex client
export const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
  {
    // Enable console logging in development
    verbose: process.env.NODE_ENV === 'development',
    
    // WebSocket configuration
    webSocketOptions: {
      // Reconnect with exponential backoff
      maxRetries: 10,
      retryDelay: (retryCount: number) => Math.min(1000 * Math.pow(2, retryCount), 30000),
    },
  }
)

// Export the client instance
export default convexClient

// Helper function to check if Convex is configured
export const isConvexConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_CONVEX_URL
}

// Helper function to get Convex URL (for debugging)
export const getConvexUrl = (): string => {
  return process.env.NEXT_PUBLIC_CONVEX_URL || 'Not configured'
}