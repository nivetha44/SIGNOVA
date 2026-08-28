import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../services/i18n'
import { getSettings, saveSettings } from '../services/localStore'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = getSettings()
    return saved.language || 'en'
  })

  useEffect(() => {
    saveSettings({ language })
    document.documentElement.lang = language
  }, [language])

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations.en?.[key] || fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: ['en', 'ta', 'hi'] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
