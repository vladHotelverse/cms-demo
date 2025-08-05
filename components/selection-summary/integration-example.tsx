"use client"

import { ABS_RoomSelectionCarousel } from '@/components/ABS_RoomSelectionCarousel'
import { ABS_RoomCustomization } from '@/components/ABS_RoomCustomization'
import { ABS_SpecialOffers } from '@/components/ABS_SpecialOffers'
import { SelectionSummary } from '@/components/selection-summary'
import { useUserSelectionsStore } from '@/stores/user-selections-store'
import type { RoomOption } from '@/components/ABS_RoomSelectionCarousel/types'
import type { OfferData } from '@/components/ABS_SpecialOffers/types'

interface IntegrationExampleProps {
  reservation: {
    checkIn: string
    checkOut: string
    nights: string
    roomNumber?: string
    originalRoomType?: string
  }
  language: 'en' | 'es'
}

/**
 * Example of how to integrate the ABS components with the Selection Summary
 * This shows the recommended pattern for connecting the components
 */
export function SelectionSummaryIntegrationExample({ reservation, language }: IntegrationExampleProps) {
  const { addRoom, addExtra, isRoomSelected } = useUserSelectionsStore()

  // Create reservation info
  const reservationInfo = {
    checkIn: reservation.checkIn,
    checkOut: new Date(
      new Date(reservation.checkIn).getTime() + 
      (parseInt(reservation.nights) * 24 * 60 * 60 * 1000)
    ).toLocaleDateString('en-GB'),
    agent: 'Online',
    roomNumber: reservation.roomNumber || '101',
    originalRoomType: reservation.originalRoomType
  }

  // Handle room selection from carousel
  const handleRoomSelection = (room: RoomOption | null) => {
    if (room && !isRoomSelected(room.roomType)) {
      addRoom(room, reservationInfo)
    }
  }

  // Handle special offer booking
  const handleOfferBooked = (offer: OfferData) => {
    addExtra(offer, 'Online')
  }

  return (
    <div className="space-y-8">
      {/* Room Selection Carousel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'es' ? 'Seleccionar Habitación' : 'Select Room'}
        </h2>
        <ABS_RoomSelectionCarousel
          roomOptions={[
            {
              id: '1',
              roomType: 'Deluxe Room',
              description: 'Spacious room with city view',
              amenities: ['WiFi', 'TV', 'Mini Bar'],
              price: 150,
              images: ['/room1.jpg']
            },
            // Add more room options
          ]}
          onRoomSelected={handleRoomSelection}
          translations={{
            selectedText: language === 'es' ? 'SELECCIONADO' : 'SELECTED',
            selectText: language === 'es' ? 'SELECCIONAR' : 'SELECT',
            nightText: language === 'es' ? '/noche' : '/night',
            priceInfoText: '',
            currencySymbol: '€',
            discountBadgeText: '-{percentage}%',
            noRoomsAvailableText: language === 'es' ? 'No hay habitaciones disponibles' : 'No rooms available',
            navigationLabels: {
              previousRoom: language === 'es' ? 'Habitación anterior' : 'Previous room',
              nextRoom: language === 'es' ? 'Siguiente habitación' : 'Next room',
              goToRoom: language === 'es' ? 'Ir a habitación {index}' : 'Go to room {index}',
              previousImage: language === 'es' ? 'Imagen anterior' : 'Previous image',
              nextImage: language === 'es' ? 'Siguiente imagen' : 'Next image',
              viewImage: language === 'es' ? 'Ver imagen {index}' : 'View image {index}'
            }
          }}
        />
      </div>

      {/* Room Customization */}
      <div className="bg-white rounded-lg shadow p-6">
        <ABS_RoomCustomization
          title={language === 'es' ? 'Personalizar Habitación' : 'Customize Room'}
          subtitle={language === 'es' ? 'Añade servicios adicionales' : 'Add additional services'}
          sections={[
            {
              key: 'view',
              title: language === 'es' ? 'Vista' : 'View'
            }
          ]}
          sectionOptions={{
            view: [
              {
                id: 'ocean',
                label: language === 'es' ? 'Vista al mar' : 'Ocean view',
                price: 50
              }
            ]
          }}
          texts={{
            improveText: language === 'es' ? 'Mejorar' : 'Improve',
            selectedText: language === 'es' ? 'Seleccionado' : 'Selected',
            selectText: language === 'es' ? 'Seleccionar' : 'Select',
            pricePerNightText: language === 'es' ? '€/noche' : '€/night',
            featuresText: language === 'es' ? 'Características' : 'Features',
            understood: language === 'es' ? 'Entendido' : 'Understood',
            addForPriceText: language === 'es' ? 'Añadir por' : 'Add for',
            availableOptionsText: language === 'es' ? 'Opciones disponibles' : 'Available options',
            removeText: language === 'es' ? 'Eliminar' : 'Remove',
            showMoreText: language === 'es' ? 'Ver más' : 'Show more',
            showLessText: language === 'es' ? 'Ver menos' : 'Show less',
            optionDisabledText: language === 'es' ? 'Opción deshabilitada' : 'Option disabled',
            conflictWithText: language === 'es' ? 'Conflicto con' : 'Conflicts with',
            keepCurrentText: language === 'es' ? 'Mantener actual' : 'Keep current',
            switchToNewText: language === 'es' ? 'Cambiar a nuevo' : 'Switch to new',
            conflictDialogTitle: language === 'es' ? 'Conflicto detectado' : 'Conflict detected',
            conflictDialogDescription: language === 'es' ? 'Por favor resuelve el conflicto' : 'Please resolve the conflict'
          }}
        />
      </div>

      {/* Special Offers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'es' ? 'Ofertas Especiales' : 'Special Offers'}
        </h2>
        <ABS_SpecialOffers
          offers={[
            {
              id: 1,
              title: language === 'es' ? 'Servicio de Spa' : 'Spa Service',
              description: language === 'es' ? 'Relájate en nuestro spa' : 'Relax in our spa',
              price: 80,
              type: 'perPerson'
            }
          ]}
          onBookOffer={handleOfferBooked}
          labels={{
            perStay: language === 'es' ? 'por estancia' : 'per stay',
            perPerson: language === 'es' ? 'por persona' : 'per person',
            perNight: language === 'es' ? 'por noche' : 'per night',
            total: language === 'es' ? 'Total:' : 'Total:',
            bookNow: language === 'es' ? 'Reservar Ahora' : 'Book Now',
            numberOfPersons: language === 'es' ? 'Número de personas' : 'Number of persons',
            numberOfNights: language === 'es' ? 'Número de noches' : 'Number of nights',
            addedLabel: language === 'es' ? 'Añadido' : 'Added',
            popularLabel: language === 'es' ? 'Popular' : 'Popular',
            personsTooltip: language === 'es' ? 'Selecciona cuántas personas usarán este servicio' : 'Select how many people will use this service',
            personsSingularUnit: language === 'es' ? 'persona' : 'person',
            personsPluralUnit: '',
            nightsTooltip: language === 'es' ? 'Selecciona el número de noches' : 'Select the number of nights',
            nightsSingularUnit: language === 'es' ? 'noche' : 'night',
            nightsPluralUnit: 's',
            personSingular: language === 'es' ? 'persona' : 'person',
            personPlural: language === 'es' ? 'personas' : 'persons',
            nightSingular: language === 'es' ? 'noche' : 'night',
            nightPlural: language === 'es' ? 'noches' : 'nights',
            removeOfferLabel: language === 'es' ? 'Eliminar de la lista' : 'Remove from List',
            decreaseQuantityLabel: language === 'es' ? 'Disminuir cantidad' : 'Decrease quantity',
            increaseQuantityLabel: language === 'es' ? 'Aumentar cantidad' : 'Increase quantity',
            selectDateLabel: language === 'es' ? 'Seleccionar fecha' : 'Select Date',
            selectDateTooltip: language === 'es' ? 'Elige la fecha para este servicio' : 'Choose the date for this service',
            dateRequiredLabel: language === 'es' ? 'Fecha requerida' : 'Date selection required'
          }}
        />
      </div>

      {/* Selection Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <SelectionSummary
          reservationInfo={reservationInfo}
          showNotifications={true}
          notificationPosition="top-right"
          translations={{
            roomsTitle: language === 'es' ? 'Habitaciones Seleccionadas' : 'Selected Rooms',
            extrasTitle: language === 'es' ? 'Servicios Extras' : 'Extra Services',
            noSelectionsText: language === 'es' ? 'No hay elementos seleccionados' : 'No items selected',
            noSelectionsSubtext: language === 'es' ? 'Selecciona habitaciones y servicios desde las opciones disponibles' : 'Select rooms and services from the available options',
            clearAllText: language === 'es' ? 'Limpiar Todo' : 'Clear All',
            clearRoomsText: language === 'es' ? 'Limpiar Habitaciones' : 'Clear Rooms',
            clearExtrasText: language === 'es' ? 'Limpiar Extras' : 'Clear Extras',
            totalPriceText: language === 'es' ? 'Total' : 'Total',
            confirmSelectionsText: language === 'es' ? 'Confirmar Selecciones' : 'Confirm Selections',
            roomAddedText: language === 'es' ? 'Habitación añadida' : 'Room added to selection',
            roomRemovedText: language === 'es' ? 'Habitación eliminada' : 'Room removed from selection',
            extraAddedText: language === 'es' ? 'Servicio extra añadido' : 'Extra service added',
            extraRemovedText: language === 'es' ? 'Servicio extra eliminado' : 'Extra service removed',
            customizationUpdatedText: language === 'es' ? 'Personalización actualizada' : 'Room customization updated',
            selectionsCleared: language === 'es' ? 'Todas las selecciones han sido eliminadas' : 'All selections cleared'
          }}
        />
      </div>
    </div>
  )
}