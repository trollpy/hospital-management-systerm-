// Notification service for handling in-app and push notifications

import { convexClient } from '@/config/convexClient'
import { api } from '../../../convex/_generated/api'

type NotificationType = 'info' | 'success' | 'warning' | 'error'
type NotificationPriority = 'low' | 'medium' | 'high'
type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  channels: NotificationChannel[]
  recipientId?: string
  recipientRole?: string
  recipientDepartment?: string
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
  read: boolean
  readAt?: string
}

interface CreateNotificationOptions {
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  channels?: NotificationChannel[]
  recipientId?: string
  recipientRole?: string
  recipientDepartment?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

/**
 * Notification service for managing system notifications
 */
export class NotificationService {
  private static instance: NotificationService

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Create a new notification
   */
  public async createNotification(options: CreateNotificationOptions): Promise<string> {
    try {
      const notificationId = await convexClient.mutation(api.notifications.create, {
        ...options,
        priority: options.priority || 'medium',
        channels: options.channels || ['in_app'],
      })

      // Trigger real-time updates
      this.triggerNotificationUpdate()

      return notificationId
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  /**
   * Get notifications for current user
   */
  public async getNotifications(options: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
    types?: NotificationType[]
  } = {}): Promise<Notification[]> {
    try {
      return await convexClient.query(api.notifications.list, options)
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await convexClient.mutation(api.notifications.markAsRead, { notificationId })
      this.triggerNotificationUpdate()
      return true
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      return false
    }
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<boolean> {
    try {
      await convexClient.mutation(api.notifications.markAllAsRead, {})
      this.triggerNotificationUpdate()
      return true
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      return false
    }
  }

  /**
   * Delete a notification
   */
  public async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await convexClient.mutation(api.notifications.delete, { notificationId })
      this.triggerNotificationUpdate()
      return true
    } catch (error) {
      console.error('Failed to delete notification:', error)
      return false
    }
  }

  /**
   * Get notification statistics
   */
  public async getNotificationStats(): Promise<{
    total: number
    unread: number
    byType: Record<NotificationType, number>
    byPriority: Record<NotificationPriority, number>
  }> {
    try {
      return await convexClient.query(api.notifications.stats, {})
    } catch (error) {
      console.error('Failed to get notification stats:', error)
      return {
        total: 0,
        unread: 0,
        byType: { info: 0, success: 0, warning: 0, error: 0 },
        byPriority: { low: 0, medium: 0, high: 0 },
      }
    }
  }

  /**
   * Send system-wide notification
   */
  public async sendSystemNotification(
    title: string,
    message: string,
    type: NotificationType = 'info'
  ): Promise<void> {
    await this.createNotification({
      type,
      title,
      message,
      channels: ['in_app'],
      priority: 'medium',
    })
  }

  /**
   * Send department-specific notification
   */
  public async sendDepartmentNotification(
    department: string,
    title: string,
    message: string,
    type: NotificationType = 'info'
  ): Promise<void> {
    await this.createNotification({
      type,
      title,
      message,
      recipientDepartment: department,
      channels: ['in_app'],
      priority: 'medium',
    })
  }

  /**
   * Send role-specific notification
   */
  public async sendRoleNotification(
    role: string,
    title: string,
    message: string,
    type: NotificationType = 'info'
  ): Promise<void> {
    await this.createNotification({
      type,
      title,
      message,
      recipientRole: role,
      channels: ['in_app'],
      priority: 'medium',
    })
  }

  /**
   * Send urgent notification
   */
  public async sendUrgentNotification(
    title: string,
    message: string,
    options?: {
      department?: string
      role?: string
      recipientId?: string
    }
  ): Promise<void> {
    await this.createNotification({
      type: 'warning',
      title,
      message,
      priority: 'high',
      channels: ['in_app', 'email'],
      recipientId: options?.recipientId,
      recipientRole: options?.role,
      recipientDepartment: options?.department,
    })
  }

  /**
   * Trigger real-time notification updates
   */
  private triggerNotificationUpdate(): void {
    // This would typically use WebSockets or similar for real-time updates
    // For now, we'll rely on Convex's real-time capabilities
    console.log('Notification update triggered')
  }

  /**
   * Subscribe to notification updates
   */
  public subscribeToNotifications(callback: (notifications: Notification[]) => void): () => void {
    // This would set up a real-time subscription
    // For Convex, we can use useQuery with real-time updates
    const unsubscribe = () => {
      // Cleanup subscription
    }

    return unsubscribe
  }

  /**
   * Schedule a notification for future delivery
   */
  public async scheduleNotification(
    options: CreateNotificationOptions & { deliverAt: string }
  ): Promise<string> {
    try {
      // This would use Convex scheduler or a similar service
      const notificationId = await convexClient.mutation(api.notifications.schedule, options)
      return notificationId
    } catch (error) {
      console.error('Failed to schedule notification:', error)
      throw error
    }
  }

  /**
   * Cancel a scheduled notification
   */
  public async cancelScheduledNotification(notificationId: string): Promise<boolean> {
    try {
      await convexClient.mutation(api.notifications.cancelScheduled, { notificationId })
      return true
    } catch (error) {
      console.error('Failed to cancel scheduled notification:', error)
      return false
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()

/**
 * React hook for notifications
 */
export function useNotifications() {
  const createNotification = async (options: CreateNotificationOptions) => {
    return notificationService.createNotification(options)
  }

  const getNotifications = async (options?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
    types?: NotificationType[]
  }) => {
    return notificationService.getNotifications(options)
  }

  const markAsRead = async (notificationId: string) => {
    return notificationService.markAsRead(notificationId)
  }

  const markAllAsRead = async () => {
    return notificationService.markAllAsRead()
  }

  const deleteNotification = async (notificationId: string) => {
    return notificationService.deleteNotification(notificationId)
  }

  const getNotificationStats = async () => {
    return notificationService.getNotificationStats()
  }

  const sendSystemNotification = async (title: string, message: string, type?: NotificationType) => {
    return notificationService.sendSystemNotification(title, message, type)
  }

  const sendDepartmentNotification = async (department: string, title: string, message: string, type?: NotificationType) => {
    return notificationService.sendDepartmentNotification(department, title, message, type)
  }

  const sendRoleNotification = async (role: string, title: string, message: string, type?: NotificationType) => {
    return notificationService.sendRoleNotification(role, title, message, type)
  }

  const sendUrgentNotification = async (title: string, message: string, options?: {
    department?: string
    role?: string
    recipientId?: string
  }) => {
    return notificationService.sendUrgentNotification(title, message, options)
  }

  return {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationStats,
    sendSystemNotification,
    sendDepartmentNotification,
    sendRoleNotification,
    sendUrgentNotification,
  }
}