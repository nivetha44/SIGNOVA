import { createContext, useContext, useState, useEffect } from 'react'
import { getSettings, saveSettings } from '../services/localStore'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = getSettings()
    return saved.theme || 'system'
  })

  const [textSize, setTextSizeState] = useState(() => {
    const saved = getSettings()
    return saved.textSize || 'normal'
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', theme)
    }
    saveSettings({ theme })
  }, [theme])

  // Apply text size to document
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize)
    saveSettings({ textSize })
  }, [textSize])

  // Listen to system theme changes if set to system
  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [theme])

  const setTheme = (newTheme) => setThemeState(newTheme)
  const setTextSize = (newSize) => setTextSizeState(newSize)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, textSize, setTextSize }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
