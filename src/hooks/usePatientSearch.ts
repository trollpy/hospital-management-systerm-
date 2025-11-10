'use client'

import { useState, useEffect, useMemo } from 'react'
import { useConvexQuery } from './useConvex'
import { api } from '../../../convex/_generated/api'
import { useDebounce } from './useDebounce'

interface PatientSearchFilters {
  gender?: string
  bloodGroup?: string
  department?: string
  status?: string
  dateRange?: {
    start: string
    end: string
  }
}

interface UsePatientSearchOptions {
  initialQuery?: string
  debounceMs?: number
  filters?: PatientSearchFilters
  limit?: number
}

/**
 * Hook for patient search functionality with filters and debouncing
 */
export function usePatientSearch(options: UsePatientSearchOptions = {}) {
  const {
    initialQuery = '',
    debounceMs = 300,
    filters = {},
    limit = 50,
  } = options

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeFilters, setActiveFilters] = useState<PatientSearchFilters>(filters)
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'lastVisit'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Debounce search query
  const debouncedQuery = useDebounce(searchQuery, debounceMs)

  // Fetch patients from Convex
  const { data: patients, isLoading, error } = useConvexQuery(
    api.patients.search,
    { query: debouncedQuery }
  )

  // Apply filters and sorting
  const filteredPatients = useMemo(() => {
    if (!patients) return []

    let result = [...patients]

    // Apply gender filter
    if (activeFilters.gender) {
      result = result.filter(patient => patient.gender === activeFilters.gender)
    }

    // Apply blood group filter
    if (activeFilters.bloodGroup) {
      result = result.filter(patient => patient.bloodGroup === activeFilters.bloodGroup)
    }

    // Apply status filter (you might need to join with visits data)
    if (activeFilters.status) {
      // This would require additional data from visits
      // For now, it's a placeholder
    }

    // Apply date range filter (for registration date)
    if (activeFilters.dateRange?.start && activeFilters.dateRange?.end) {
      result = result.filter(patient => {
        const patientDate = new Date(patient.createdAt)
        const startDate = new Date(activeFilters.dateRange!.start)
        const endDate = new Date(activeFilters.dateRange!.end)
        return patientDate >= startDate && patientDate <= endDate
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'createdAt':
          aValue = a.createdAt
          bValue = b.createdAt
          break
        case 'lastVisit':
          // This would require joining with visits data
          aValue = a.createdAt // Placeholder
          bValue = b.createdAt // Placeholder
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    // Apply limit
    return result.slice(0, limit)
  }, [patients, activeFilters, sortBy, sortOrder, limit])

  // Search statistics
  const searchStats = useMemo(() => {
    return {
      total: patients?.length || 0,
      filtered: filteredPatients.length,
      hasResults: filteredPatients.length > 0,
      hasFilters: Object.values(activeFilters).some(value => 
        value !== undefined && value !== ''
      ),
    }
  }, [patients, filteredPatients, activeFilters])

  // Search actions
  const clearSearch = () => {
    setSearchQuery('')
    setActiveFilters({})
  }

  const clearFilters = () => {
    setActiveFilters({})
  }

  const updateFilter = (filter: keyof PatientSearchFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: value,
    }))
  }

  const setSorting = (field: typeof sortBy, order: typeof sortOrder) => {
    setSortBy(field)
    setSortOrder(order)
  }

  // Quick search suggestions (based on recent searches or common terms)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const addToSearchHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]) // Keep last 10
    }
  }

  useEffect(() => {
    if (debouncedQuery.trim()) {
      addToSearchHistory(debouncedQuery)
    }
  }, [debouncedQuery])

  return {
    // State
    searchQuery,
    setSearchQuery,
    activeFilters,
    sortBy,
    sortOrder,

    // Data
    patients: filteredPatients,
    allPatients: patients || [],
    isLoading,
    error,

    // Statistics
    stats: searchStats,

    // Actions
    clearSearch,
    clearFilters,
    updateFilter,
    setSorting,

    // Search history
    searchHistory,
    clearSearchHistory: () => setSearchHistory([]),

    // Utility
    hasSearched: searchQuery.length > 0 || Object.values(activeFilters).some(Boolean),
  }
}

/**
 * Hook for patient search with real-time suggestions
 */
export function usePatientSearchWithSuggestions(options: UsePatientSearchOptions = {}) {
  const search = usePatientSearch(options)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Generate suggestions based on current query
  useEffect(() => {
    if (search.searchQuery.length > 1 && search.allPatients.length > 0) {
      const query = search.searchQuery.toLowerCase()
      const matchedPatients = search.allPatients
        .filter(patient => 
          patient.firstName.toLowerCase().includes(query) ||
          patient.lastName.toLowerCase().includes(query) ||
          patient.mrn.includes(query) ||
          patient.phone.includes(query)
        )
        .slice(0, 5) // Limit suggestions

      setSuggestions(matchedPatients)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [search.searchQuery, search.allPatients])

  const selectSuggestion = (patient: any) => {
    search.setSearchQuery(`${patient.firstName} ${patient.lastName}`)
    setShowSuggestions(false)
  }

  const hideSuggestions = () => {
    setShowSuggestions(false)
  }

  return {
    ...search,
    suggestions,
    showSuggestions,
    selectSuggestion,
    hideSuggestions,
  }
}

/**
 * Hook for advanced patient search with multiple criteria
 */
export function useAdvancedPatientSearch() {
  const search = usePatientSearch()

  // Additional search criteria
  const [advancedCriteria, setAdvancedCriteria] = useState({
    ageRange: { min: 0, max: 100 },
    hasAllergies: undefined as boolean | undefined,
    hasChronicConditions: undefined as boolean | undefined,
    lastVisitWithin: undefined as number | undefined, // days
  })

  const updateAdvancedCriteria = (criteria: Partial<typeof advancedCriteria>) => {
    setAdvancedCriteria(prev => ({ ...prev, ...criteria }))
  }

  // Apply advanced filters
  const advancedFilteredPatients = useMemo(() => {
    return search.patients.filter(patient => {
      // Age filter
      const age = calculateAge(patient.dateOfBirth)
      if (age < advancedCriteria.ageRange.min || age > advancedCriteria.ageRange.max) {
        return false
      }

      // Allergies filter
      if (advancedCriteria.hasAllergies !== undefined) {
        const hasAllergies = patient.allergies && patient.allergies.length > 0
        if (hasAllergies !== advancedCriteria.hasAllergies) {
          return false
        }
      }

      // Chronic conditions filter
      if (advancedCriteria.hasChronicConditions !== undefined) {
        const hasChronicConditions = patient.medicalHistory?.some(
          (condition: any) => condition.status === 'chronic'
        )
        if (hasChronicConditions !== advancedCriteria.hasChronicConditions) {
          return false
        }
      }

      // Last visit filter (would require visits data)
      // This is a placeholder implementation

      return true
    })
  }, [search.patients, advancedCriteria])

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return {
    ...search,
    patients: advancedFilteredPatients,
    advancedCriteria,
    updateAdvancedCriteria,
    clearAdvancedCriteria: () => setAdvancedCriteria({
      ageRange: { min: 0, max: 100 },
      hasAllergies: undefined,
      hasChronicConditions: undefined,
      lastVisitWithin: undefined,
    }),
  }
}