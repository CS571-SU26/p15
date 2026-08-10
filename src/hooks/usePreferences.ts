import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface PreferencesContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  reducedMotion: boolean
  setReducedMotion: (reducedMotion: boolean) => void
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
