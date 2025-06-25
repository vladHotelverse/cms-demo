export interface BandPrice {
  bandId: string
  price: number
}

export interface CalendarBandAssignment {
  month: number // 0-11 for January-December
  dayOfWeek: number // 0-6 for Sunday-Saturday
  bandId: string
}
