import { useLanguage } from '@/contexts/language-context'
import { reservationSummaryTranslations } from '@/translations/reservation-summary'

export function useReservationTranslations() {
  const { currentLanguage } = useLanguage()
  const translations = reservationSummaryTranslations[currentLanguage as keyof typeof reservationSummaryTranslations] || reservationSummaryTranslations.en
  
  const t = (key: string, paramsOrFallback?: any) => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value === 'string' && paramsOrFallback && typeof paramsOrFallback === 'object') {
      return value.replace(/\{\{(\w+)\}\}/g, (_: any, k: string) => paramsOrFallback[k] || '')
    }
    
    return (typeof value === 'string' ? value : undefined) || (typeof paramsOrFallback === 'string' ? paramsOrFallback : undefined) || key
  }
  
  return { t, translations }
}