import { convexClient } from '@/config/convexClient'
import { api } from '../../../convex/_generated/api'

// Analytics event types
type AnalyticsEvent = 
  | 'page_view'
  | 'user_login'
  | 'user_logout'
  | 'patient_created'
  | 'patient_updated'
  | 'appointment_created'
  | 'appointment_updated'
  | 'visit_created'
  | 'visit_updated'
  | 'prescription_created'
  | 'lab_order_created'
  | 'invoice_created'
  | 'payment_received'

interface AnalyticsEventData {
  event: AnalyticsEvent
  userId?: string
  userRole?: string
  metadata?: Record<string, any>
  timestamp: number
}

/**
 * Analytics service for tracking user interactions and system events
 */
export class AnalyticsService {
  private static instance: AnalyticsService
  private enabled: boolean = true

  private constructor() {
    // Check if analytics is enabled
    this.enabled = process.env.NODE_ENV === 'production'
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  /**
   * Track an analytics event
   */
  public async trackEvent(
    event: AnalyticsEvent,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.enabled) return

    try {
      const eventData: AnalyticsEventData = {
        event,
        metadata,
        timestamp: Date.now(),
      }

      // Send to Convex for storage
      await convexClient.mutation(api.analytics.trackEvent, eventData)

      // Also send to external analytics service if configured
      await this.sendToExternalAnalytics(event, metadata)
    } catch (error) {
      console.warn('Failed to track analytics event:', error)
    }
  }

  /**
   * Track page views
   */
  public async trackPageView(page: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent('page_view', {
      page,
      ...metadata,
    })
  }

  /**
   * Track user actions
   */
  public async trackUserAction(
    action: string,
    resource: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('user_action' as AnalyticsEvent, {
      action,
      resource,
      ...metadata,
    })
  }

  /**
   * Track errors
   */
  public async trackError(
    error: Error,
    context?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('error' as AnalyticsEvent, {
      error: error.message,
      stack: error.stack,
      context,
      ...metadata,
    })
  }

  /**
   * Send to external analytics service (e.g., Google Analytics, Mixpanel)
   */
  private async sendToExternalAnalytics(
    event: AnalyticsEvent,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Implementation for external analytics services
    // This would integrate with services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - etc.

    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Google Analytics 4
      (window as any).gtag('event', event, metadata)
    }

    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      // Mixpanel
      (window as any).mixpanel.track(event, metadata)
    }
  }

  /**
   * Get analytics dashboard data
   */
  public async getDashboardData(
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      return await convexClient.query(api.analytics.getDashboardData, {
        startDate,
        endDate,
      })
    } catch (error) {
      console.error('Failed to get analytics dashboard data:', error)
      throw error
    }
  }

  /**
   * Get user activity report
   */
  public async getUserActivityReport(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      return await convexClient.query(api.analytics.getUserActivity, {
        userId,
        startDate,
        endDate,
      })
    } catch (error) {
      console.error('Failed to get user activity report:', error)
      throw error
    }
  }

  /**
   * Get system performance metrics
   */
  public async getPerformanceMetrics(): Promise<any> {
    try {
      return await convexClient.query(api.analytics.getPerformanceMetrics, {})
    } catch (error) {
      console.error('Failed to get performance metrics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance()

/**
 * React hook for analytics
 */
export function useAnalytics() {
  const trackEvent = async (event: AnalyticsEvent, metadata?: Record<string, any>) => {
    await analyticsService.trackEvent(event, metadata)
  }

  const trackPageView = async (page: string, metadata?: Record<string, any>) => {
    await analyticsService.trackPageView(page, metadata)
  }

  const trackUserAction = async (action: string, resource: string, metadata?: Record<string, any>) => {
    await analyticsService.trackUserAction(action, resource, metadata)
  }

  const trackError = async (error: Error, context?: string, metadata?: Record<string, any>) => {
    await analyticsService.trackError(error, context, metadata)
  }

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackError,
  }
}