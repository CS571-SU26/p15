import { useEffect, useState, type ReactNode } from 'react'
import { PreferencesContext, type Theme } from '../hooks/usePreferences'

const THEME_STORAGE_KEY = 'wsps:theme'
const REDUCED_MOTION_STORAGE_KEY = 'wsps:reducedMotion'

function loadInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadInitialReducedMotion(): boolean {
  const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)
  if (stored === 'true' || stored === 'false') return stored === 'true'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(loadInitialTheme)
  const [reducedMotion, setReducedMotion] = useState<boolean>(loadInitialReducedMotion)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(reducedMotion))
  }, [reducedMotion])

  return (
    <PreferencesContext.Provider value={{ theme, setTheme, reducedMotion, setReducedMotion }}>
      {children}
    </PreferencesContext.Provider>
  )
}
