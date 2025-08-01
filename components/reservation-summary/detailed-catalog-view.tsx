"use client"

import ReservationDetailsTab from "../reservation-details-tab"

interface DetailedCatalogViewProps {
  reservation: {
    id: string
    locator: string
    name: string
    email: string
    checkIn: string
    nights: string
    roomType: string
    aci: string
    status: string
    extras: string
    hasHotelverseRequest: boolean
  }
  onCloseTab?: () => void
}

export function DetailedCatalogView({ reservation, onCloseTab }: DetailedCatalogViewProps) {
  return (
    <ReservationDetailsTab
      reservation={reservation}
      onShowAlert={() => {}}
      onCloseTab={onCloseTab || (() => {})}
      isInReservationMode={false}
    />
  )
}