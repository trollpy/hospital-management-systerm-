'use client'

import { useCallback } from 'react'
import { useApp } from '@/contexts/AppProvider'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationOptions {
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Hook for showing notifications throughout the app
 */
export function useNotification() {
  const { showNotification, showError, showSuccess, showWarning } = useApp()

  const notify = useCallback((
    type: NotificationType,
    options: NotificationOptions
  ) => {
    showNotification({
      type,
      title: options.title,
      message: options.message,
    })
  }, [showNotification])

  const success = useCallback((
    title: string,
    message?: string,
    options?: Omit<NotificationOptions, 'title' | 'message'>
  ) => {
    showSuccess(title, message)
  }, [showSuccess])

  const error = useCallback((
    title: string,
    message?: string,
    options?: Omit<NotificationOptions, 'title' | 'message'>
  ) => {
    showError(title, message)
  }, [showError])

  const warning = useCallback((
    title: string,
    message?: string,
    options?: Omit<NotificationOptions, 'title' | 'message'>
  ) => {
    showWarning(title, message)
  }, [showWarning])

  const info = useCallback((
    title: string,
    message?: string,
    options?: Omit<NotificationOptions, 'title' | 'message'>
  ) => {
    notify('info', { title, message, ...options })
  }, [notify])

  return {
    notify,
    success,
    error,
    warning,
    info,
  }
}

/**
 * Hook for showing system notifications (browser notifications)
 */
export function useSystemNotification() {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission has been denied')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }, [])

  const showNotification = useCallback((
    title: string,
    options?: NotificationOptions
  ) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const notification = new Notification(title, {
      body: options?.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'hms-notification',
      requireInteraction: options?.duration === 0,
    })

    if (options?.action) {
      notification.addEventListener('click', () => {
        options.action!.onClick()
        notification.close()
      })
    }

    if (options?.duration && options.duration > 0) {
      setTimeout(() => {
        notification.close()
      }, options.duration)
    }

    return notification
  }, [])

  return {
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window,
    permission: Notification.permission,
  }
}

/**
 * Hook for showing toast notifications
 */
export function useToastNotification() {
  const { success, error, warning, info } = useNotification()

  const showToast = useCallback((
    type: NotificationType,
    title: string,
    message?: string
  ) => {
    switch (type) {
      case 'success':
        success(title, message)
        break
      case 'error':
        error(title, message)
        break
      case 'warning':
        warning(title, message)
        break
      case 'info':
        info(title, message)
        break
    }
  }, [success, error, warning, info])

  return {
    showToast,
    success: (title: string, message?: string) => showToast('success', title, message),
    error: (title: string, message?: string) => showToast('error', title, message),
    warning: (title: string, message?: string) => showToast('warning', title, message),
    info: (title: string, message?: string) => showToast('info', title, message),
  }
}