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
}

export function DetailedCatalogView({ reservation }: DetailedCatalogViewProps) {
  return (
    <ReservationDetailsTab
      reservation={reservation}
      onShowAlert={() => {}}
      onCloseTab={() => {}}
      isInReservationMode={false}
    />
  )
}