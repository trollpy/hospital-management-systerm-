'use client'

import { useQuery, useMutation, useConvex } from 'convex/react'
import { useState, useEffect, useCallback } from 'react'

/**
 * Enhanced useQuery hook with loading states and error handling
 */
export function useConvexQuery<T>(
  query: any,
  args?: any,
  options?: {
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | undefined>(undefined)

  const result = useQuery(query, options?.enabled === false ? undefined : args)

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true)
      return
    }

    setIsLoading(false)
    
    if (result instanceof Error) {
      setError(result)
      options?.onError?.(result)
    } else {
      setData(result as T)
      setError(null)
      options?.onSuccess?.(result as T)
    }
  }, [result, options])

  return {
    data,
    isLoading,
    error,
    isError: !!error,
    refetch: () => {
      // Convex queries are automatically reactive
      // This is just for triggering a re-render
      setData(undefined)
      setIsLoading(true)
    },
  }
}

/**
 * Enhanced useMutation hook with loading states and error handling
 */
export function useConvexMutation<T = any, V = any>(
  mutation: any,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    onMutate?: (variables: V) => void
  }
) {
  const convex = useConvex()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | undefined>(undefined)

  const mutate = useCallback(
    async (variables: V): Promise<T> => {
      setIsLoading(true)
      setError(null)
      options?.onMutate?.(variables)

      try {
        const result = await convex.mutation(mutation, variables)
        setData(result)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [convex, mutation, options]
  )

  const mutateAsync = useCallback(
    async (variables: V): Promise<T> => {
      return mutate(variables)
    },
    [mutate]
  )

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(undefined)
  }, [])

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError: !!error,
    error,
    data,
    reset,
  }
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticMutation<T = any, V = any>(
  mutation: any,
  optimisticUpdate: (currentData: any, variables: V) => any,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const convex = useConvex()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (variables: V, currentData: any): Promise<T> => {
      setIsLoading(true)
      setError(null)

      // Apply optimistic update
      const optimisticData = optimisticUpdate(currentData, variables)

      try {
        const result = await convex.mutation(mutation, variables)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed')
        setError(error)
        options?.onError?.(error)
        
        // Revert optimistic update on error
        // You might want to trigger a refetch here
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [convex, mutation, optimisticUpdate, options]
  )

  return {
    mutate,
    isLoading,
    isError: !!error,
    error,
  }
}

/**
 * Hook for real-time subscriptions with Convex
 */
export function useConvexSubscription<T>(
  query: any,
  args?: any,
  options?: {
    onUpdate?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const result = useQuery(query, args)

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true)
      return
    }

    setIsLoading(false)
    
    if (result instanceof Error) {
      setError(result)
      options?.onError?.(result)
    } else {
      const newData = result as T
      setData(newData)
      setError(null)
      options?.onUpdate?.(newData)
    }
  }, [result, options])

  return {
    data,
    isLoading,
    error,
    isError: !!error,
  }
}

/**
 * Hook for paginated queries
 */
export function usePaginatedQuery<T>(
  query: any,
  pageSize: number = 20,
  args?: any
) {
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { data, isLoading, error } = useConvexQuery<T[]>(
    query,
    { ...args, limit: pageSize, offset: page * pageSize }
  )

  useEffect(() => {
    if (data && data.length < pageSize) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [data, pageSize])

  const nextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1)
    }
  }

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  return {
    data: data || [],
    isLoading,
    error,
    page,
    hasMore,
    nextPage,
    prevPage,
    goToPage,
    canGoNext: hasMore,
    canGoPrev: page > 0,
  }
}

/**
 * Hook for infinite scrolling
 */
export function useInfiniteQuery<T>(
  query: any,
  pageSize: number = 20,
  args?: any
) {
  const [pages, setPages] = useState<T[][]>([])
  const [hasMore, setHasMore] = useState(true)

  const { data, isLoading, error } = useConvexQuery<T[]>(
    query,
    { ...args, limit: pageSize, offset: pages.length * pageSize }
  )

  useEffect(() => {
    if (data) {
      setPages(prev => [...prev, data])
      
      if (data.length < pageSize) {
        setHasMore(false)
      }
    }
  }, [data, pageSize])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      // The next page will be loaded automatically because offset changes
    }
  }

  const reset = () => {
    setPages([])
    setHasMore(true)
  }

  const allData = pages.flat()

  return {
    data: allData,
    isLoading,
    error,
    hasMore,
    loadMore,
    reset,
    pageCount: pages.length,
  }
}