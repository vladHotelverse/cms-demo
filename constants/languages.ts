/**
 * Language configuration for internationalization
 * Centralized list of supported languages in the hotel management system
 */
export interface Language {
  id: string
  name: string
  nativeName: string
  code: string
  flag?: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: "es", name: "Spanish", nativeName: "Español", code: "es", flag: "🇪🇸" },
  { id: "en", name: "English", nativeName: "English", code: "en", flag: "🇺🇸" },
  { id: "fr", name: "French", nativeName: "Français", code: "fr", flag: "🇫🇷" },
  { id: "de", name: "German", nativeName: "Deutsch", code: "de", flag: "🇩🇪" },
  { id: "it", name: "Italian", nativeName: "Italiano", code: "it", flag: "🇮🇹" },
  { id: "pt", name: "Portuguese", nativeName: "Português", code: "pt", flag: "🇵🇹" },
  { id: "zh", name: "Chinese", nativeName: "中文", code: "zh", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", nativeName: "日本語", code: "ja", flag: "🇯🇵" },
  { id: "ru", name: "Russian", nativeName: "Русский", code: "ru", flag: "🇷🇺" },
]

/**
 * Get language by ID
 */
export const getLanguageById = (id: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(language => language.id === id)
}

/**
 * Get language options for select components
 */
export const getLanguageOptions = () => {
  return SUPPORTED_LANGUAGES.map(language => ({
    value: language.id,
    label: `${language.flag} ${language.name}`
  }))
}

/**
 * Get primary languages (most commonly used)
 */
export const getPrimaryLanguages = (): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => ['es', 'en', 'fr', 'de'].includes(lang.id))
}

