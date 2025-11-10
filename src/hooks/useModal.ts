'use client'

import { useState, useCallback } from 'react'

interface UseModalOptions {
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

/**
 * Hook for managing modal state
 */
export function useModal(options: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(options.defaultOpen || false)

  const open = useCallback(() => {
    setIsOpen(true)
    options.onOpen?.()
  }, [options])

  const close = useCallback(() => {
    setIsOpen(false)
    options.onClose?.()
  }, [options])

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev
      if (newState) {
        options.onOpen?.()
      } else {
        options.onClose?.()
      }
      return newState
    })
  }, [options])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

/**
 * Hook for managing multiple modals
 */
export function useModals<T extends string>(
  modalNames: T[],
  options: {
    [K in T]?: UseModalOptions
  } = {}
) {
  const [modals, setModals] = useState<Record<T, boolean>>(
    modalNames.reduce((acc, name) => {
      acc[name] = options[name]?.defaultOpen || false
      return acc
    }, {} as Record<T, boolean>)
  )

  const open = useCallback((modalName: T) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
    options[modalName]?.onOpen?.()
  }, [options])

  const close = useCallback((modalName: T) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
    options[modalName]?.onClose?.()
  }, [options])

  const toggle = useCallback((modalName: T) => {
    setModals(prev => {
      const newState = { ...prev, [modalName]: !prev[modalName] }
      if (newState[modalName]) {
        options[modalName]?.onOpen?.()
      } else {
        options[modalName]?.onClose?.()
      }
      return newState
    })
  }, [options])

  const isOpen = useCallback((modalName: T): boolean => {
    return modals[modalName] || false
  }, [modals])

  const closeAll = useCallback(() => {
    setModals(prev => {
      const newState = { ...prev }
      modalNames.forEach(name => {
        newState[name] = false
        options[name]?.onClose?.()
      })
      return newState
    })
  }, [modalNames, options])

  const openAll = useCallback(() => {
    setModals(prev => {
      const newState = { ...prev }
      modalNames.forEach(name => {
        newState[name] = true
        options[name]?.onOpen?.()
      })
      return newState
    })
  }, [modalNames, options])

  return {
    modals,
    open,
    close,
    toggle,
    isOpen,
    closeAll,
    openAll,
  }
}

/**
 * Hook for modal with data
 */
export function useModalWithData<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((modalData?: T) => {
    if (modalData) {
      setData(modalData)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Don't clear data immediately to avoid flicker during close animation
    setTimeout(() => setData(null), 300)
  }, [])

  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => prev ? { ...prev, ...newData } : null)
  }, [])

  return {
    isOpen,
    data,
    open,
    close,
    updateData,
  }
}

/**
 * Hook for confirmation modal
 */
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
  } | null>(null)

  const open = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      onCancel?: () => void
      confirmText?: string
      cancelText?: string
      variant?: 'danger' | 'warning' | 'info'
    }
  ) => {
    setConfig({
      title,
      message,
      onConfirm,
      onCancel: options?.onCancel,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      variant: options?.variant,
    })
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    config?.onCancel?.()
    setTimeout(() => setConfig(null), 300)
  }, [config])

  const confirm = useCallback(() => {
    config?.onConfirm()
    close()
  }, [config, close])

  return {
    isOpen,
    config,
    open,
    close,
    confirm,
  }
}

/**
 * Hook for modal with form state
 */
export function useFormModal<T extends Record<string, any>>(
  defaultValues: T,
  options?: UseModalOptions
) {
  const modal = useModal(options)
  const [formData, setFormData] = useState<T>(defaultValues)
  const [isDirty, setIsDirty] = useState(false)

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(defaultValues)
    setIsDirty(false)
  }, [defaultValues])

  const open = useCallback((initialData?: Partial<T>) => {
    if (initialData) {
      setFormData({ ...defaultValues, ...initialData })
    } else {
      resetForm()
    }
    modal.open()
  }, [defaultValues, resetForm, modal])

  const close = useCallback(() => {
    modal.close()
    // Reset form after close animation
    setTimeout(resetForm, 300)
  }, [modal, resetForm])

  return {
    ...modal,
    formData,
    updateFormData,
    resetForm,
    isDirty,
    open,
    close,
  }
}