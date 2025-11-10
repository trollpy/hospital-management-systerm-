'use client'

import { useState, useEffect } from 'react'

/**
 * Debounce a value with a delay
 * Useful for search inputs, API calls, etc.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const debouncedCallback = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return debouncedCallback
}

/**
 * Debounce with immediate execution option
 */
export function useAdvancedDebounce<T>(
  value: T,
  delay: number,
  options?: {
    immediate?: boolean
    maxWait?: number
  }
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [lastCallTime, setLastCallTime] = useState<number>(0)

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    // Immediate execution for first call or if maxWait exceeded
    if (options?.immediate && timeSinceLastCall === 0) {
      setDebouncedValue(value)
      setLastCallTime(now)
      return
    }

    if (options?.maxWait && timeSinceLastCall >= options.maxWait) {
      setDebouncedValue(value)
      setLastCallTime(now)
      return
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setLastCallTime(Date.now())
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, options, lastCallTime])

  return debouncedValue
}