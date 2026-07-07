/**
 * When true, the app uses in-memory mock data instead of Supabase.
 * Defaults to mock mode when NEXT_PUBLIC_USE_MOCK_DATA is set or Supabase env vars are missing.
 */
export function isMockDataMode(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return true
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false') return false

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !url || !key
}
