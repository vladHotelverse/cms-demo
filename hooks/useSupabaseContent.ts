import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Types for our data - matching ABS structure with multilingual support
export interface RoomType {
  id: string
  room_code: string
  title: Record<string, string> // {"en": "Room Name", "es": "Nombre Habitación"}
  description: Record<string, string>
  base_price: number
  main_image: string
  images?: string[]
  amenities: string[] // ABS expects "amenities" not "features"
  capacity?: number
  size_sqm?: number
  room_type: string
  rating?: number
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CustomizationOption {
  id: string
  option_code: string
  category: string
  name: Record<string, string> // Multilingual
  description?: Record<string, string> // Multilingual
  price: number
  price_type: 'per_night' | 'per_person' | 'per_stay'
  icon?: string
  popular: boolean
  active: boolean
  sort_order: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SpecialOffer {
  id: string
  offer_code: string
  name: Record<string, string> // Multilingual
  description?: Record<string, string> // Multilingual
  image: string // ABS expects "image" not "icon"
  price: number
  price_type: 'per_person' | 'per_stay' | 'per_night'
  requires_date_selection?: boolean
  allows_multiple_dates?: boolean
  max_quantity?: number
  popular: boolean
  active: boolean
  valid_from?: string
  valid_until?: string
  sort_order: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TranslationMap {
  [key: string]: string
}

// Hook to fetch translations
export function useTranslations(language: string = 'en', category?: string) {
  const [translations, setTranslations] = useState<TranslationMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTranslations() {
      try {
        setLoading(true)
        const supabase = createClient()
        let query = supabase
          .from('translations')
          .select('key, value')
          .eq('language', language)

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) throw error

        // Convert array to key-value map
        const translationMap: TranslationMap = {}
        data?.forEach((item) => {
          translationMap[item.key] = item.value
        })

        setTranslations(translationMap)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching translations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [language, category])

  return { translations, loading, error }
}

// Hook to fetch room types
export function useRoomTypes(active: boolean = true) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('active', active)
          .order('base_price', { ascending: true })

        if (error) throw error

        setRoomTypes(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching room types:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomTypes()
  }, [active])

  return { roomTypes, loading, error }
}

// Hook to fetch customization options
export function useCustomizationOptions(category?: string, active: boolean = true) {
  const [options, setOptions] = useState<CustomizationOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        let query = supabase
          .from('customization_options')
          .select('*')
          .eq('active', active)
          .order('sort_order', { ascending: true })

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) throw error

        setOptions(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching customization options:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [category, active])

  return { options, loading, error }
}

// Hook to fetch special offers
export function useSpecialOffers(active: boolean = true) {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true)
        const supabase = createClient()
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
          .from('special_offers')
          .select('*')
          .eq('active', active)
          .or(`valid_from.is.null,valid_from.lte.${today}`)
          .or(`valid_until.is.null,valid_until.gte.${today}`)
          .order('sort_order', { ascending: true })

        if (error) throw error

        setOffers(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching special offers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [active])

  return { offers, loading, error }
}

// Combined hook for all content
export function useReservationContent(language: string = 'en') {
  const { translations, loading: translationsLoading, error: translationsError } = useTranslations(language)
  const { roomTypes, loading: roomsLoading, error: roomsError } = useRoomTypes()
  const { options: customizationOptions, loading: customizationsLoading, error: customizationsError } = useCustomizationOptions()
  const { offers: specialOffers, loading: offersLoading, error: offersError } = useSpecialOffers()

  const loading = translationsLoading || roomsLoading || customizationsLoading || offersLoading
  const error = translationsError || roomsError || customizationsError || offersError

  return {
    translations,
    roomTypes,
    customizationOptions,
    specialOffers,
    loading,
    error,
  }
}