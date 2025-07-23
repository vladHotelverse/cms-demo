import { useLanguage } from '@/contexts/language-context'
import { reservationSummaryTranslations } from '@/translations/reservation-summary'

export function useReservationTranslations() {
  const { locale } = useLanguage()
  const translations = reservationSummaryTranslations[locale as keyof typeof reservationSummaryTranslations] || reservationSummaryTranslations.es
  
  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '')
    }
    
    return value || key
  }
  
  return { t, translations }
}