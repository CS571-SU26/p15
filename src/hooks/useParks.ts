import { createContext, useContext } from 'react'
import type { Park } from '../types/park'

export interface ParksContextValue {
  parks: Park[]
  loading: boolean
  error: string | null
  isVisited: (id: number) => boolean
  toggleVisited: (id: number) => void
  clearVisited: () => void
}

export const ParksContext = createContext<ParksContextValue | null>(null)

export function useParks() {
  const context = useContext(ParksContext)
  if (!context) {
    throw new Error('useParks must be used within a ParksProvider')
  }
  return context
}
