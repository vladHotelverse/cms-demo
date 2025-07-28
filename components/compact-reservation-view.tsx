"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useReservationContent } from "@/hooks/useSupabaseContent";
import type { RoomType, CustomizationOption, SpecialOffer } from "@/hooks/useSupabaseContent";

// Import ABS translations
import { absTranslations } from "@/locales/abs-translations";

interface CompactReservationViewProps {
  selectedRoom: any;
  roomCustomizations: {
    [key: string]: { id: string; label: string; price: number } | undefined;
  };
  bookedOffers: any[];
  onRoomSelected: (room: any) => void;
  onRoomCustomizationChange: (
    category: string,
    optionId: string,
    optionLabel: string,
    optionPrice: number,
  ) => void;
  onOfferBook: (offerData: any) => void;
  onShowAlert: (type: "success" | "error", message: string) => void;
}

// Transform functions (simplified versions)
function transformRoomTypesToCompact(roomTypes: RoomType[], currentLanguage: string = 'en') {
  return roomTypes.map(room => {
    const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return value[currentLanguage] || value['en'] || value['es'] || fallback;
      }
      return fallback;
    };

    const roomName = getMultilingualValue(room.name, "Room");
    const roomDescription = getMultilingualValue(room.description, "Comfortable room");
    const roomPrice = Number(room.base_price) || 0;
    
    return {
      id: String(room.id),
      name: roomName,
      description: roomDescription,
      price: roomPrice,
      image: room.main_image,
      amenities: Array.isArray(room.amenities) ? room.amenities.slice(0, 3) : [],
      category: room.category,
    };
  });
}

function transformCustomizationToCompact(options: CustomizationOption[], currentLanguage: string = 'en') {
  const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[currentLanguage] || value['en'] || value['es'] || fallback;
    }
    return fallback;
  };

  // Group by category and return categories
  const groupedOptions: { [category: string]: any[] } = {};
  
  options.forEach(option => {
    const category = option.category || "Other";
    const optionName = getMultilingualValue(option.name, "Option");
    const optionDescription = getMultilingualValue(option.description, `${optionName} upgrade`);
    const optionPrice = Number(option.price) || 0;
    
    if (!groupedOptions[category]) {
      groupedOptions[category] = [];
    }
    
    groupedOptions[category].push({
      id: String(option.id),
      name: optionName,
      description: optionDescription,
      price: optionPrice,
      popular: Boolean(option.popular),
    });
  });

  return Object.keys(groupedOptions).map(category => ({
    name: category,
    options: groupedOptions[category],
  }));
}

function transformOffersToCompact(offers: SpecialOffer[], currentLanguage: string = 'en') {
  const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[currentLanguage] || value['en'] || value['es'] || fallback;
    }
    return fallback;
  };

  return offers.map((offer, index) => {
    const offerName = getMultilingualValue(offer.name, "Special Offer");
    const offerDescription = getMultilingualValue(offer.description, "");
    const offerPrice = Number(offer.price) || 0;
    
    return {
      id: offer.id || `offer-${index}`,
      name: offerName,
      description: offerDescription,
      price: offerPrice,
      image: offer.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      popular: Boolean(offer.popular || false),
      priceType: offer.price_type || 'per_stay',
    };
  });
}

export default function CompactReservationView({
  selectedRoom,
  roomCustomizations,
  bookedOffers,
  onRoomSelected,
  onRoomCustomizationChange,
  onOfferBook,
  onShowAlert,
}: CompactReservationViewProps) {
  const { currentLanguage } = useLanguage();
  const { roomTypes, customizationOptions, specialOffers, loading, error } = useReservationContent(currentLanguage);

  // Navigation states
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentCustomizationIndex, setCurrentCustomizationIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Helper function to get ABS translations
  const getABSTranslation = (key: string): string => {
    const lang = currentLanguage === "es" ? "es" : "en";
    return (absTranslations as any)[lang][key] || key;
  };

  // Provide fallback data if Supabase data is not available
  const safeRoomTypes = roomTypes && roomTypes.length > 0 ? roomTypes : [
    {
      id: "supreme-luxury-suite",
      room_code: "supreme-luxury",
      name: { en: "Supreme luxury with divine views", es: "Lujo supremo con vistas divinas" },
      description: { en: "Contemporary Hard Rock Ibiza Suite with rock 'n' roll authenticity", es: "Suite contemporánea Hard Rock Ibiza con autenticidad rock and roll" },
      base_price: 89,
      main_image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      amenities: ["24 Hours Room Service", "Balcony", "Landmark View"],
      category: "ROCK SUITE",
      capacity: 2, size_sqm: 60, rating: 4.8, active: true, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: "nostalgia-suite",
      room_code: "80s-nostalgia", 
      name: { en: "80s nostalgia unleashed", es: "Nostalgia de los 80 desatada" },
      description: { en: "60 square-meter space with bold colors and vintage decor", es: "Espacio de 60 metros cuadrados con colores vibrantes y decoración vintage" },
      base_price: 120,
      main_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      amenities: ["Coffee Machine", "King Size Bed", "80s Themed Decor"],
      category: "80S SUITE",
      capacity: 2, size_sqm: 60, rating: 4.7, active: true, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  ];

  const safeCustomizationOptions = customizationOptions && customizationOptions.length > 0 ? customizationOptions : [
    {
      id: "twin-beds", option_code: "twin-beds", category: "Beds",
      name: { en: "2 x Twin Beds", es: "2 x Camas Individuales" },
      description: { en: "Two separate single beds", es: "Dos camas individuales separadas" },
      price: 0.00, price_type: "per_night" as const, icon: "bed-twin", popular: false, active: true, sort_order: 1,
      metadata: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: "king-bed", option_code: "king-bed", category: "Beds",
      name: { en: "King Size Bed", es: "Cama King Size" },
      description: { en: "One extra-large king-sized bed", es: "Una cama king extra grande" },
      price: 5.00, price_type: "per_night" as const, icon: "bed-king", popular: true, active: true, sort_order: 2,
      metadata: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  ];

  const safeSpecialOffers = specialOffers && specialOffers.length > 0 ? specialOffers : [
    {
      id: "all-inclusive-package", offer_code: "all-inclusive",
      name: { en: "All inclusive package", es: "Paquete todo incluido" },
      description: { en: "Unlimited access to all amenities, meals and beverages", es: "Acceso ilimitado a todas las comodidades, comidas y bebidas" },
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      price: 50.00, price_type: "per_person" as const, requires_date_selection: false, allows_multiple_dates: false,
      max_quantity: 10, popular: true, active: true, valid_from: undefined, valid_until: undefined, sort_order: 1,
      metadata: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: "spa-access", offer_code: "spa-access",
      name: { en: "Spa Access", es: "Acceso al Spa" },
      description: { en: "Enjoy a day of relaxation at our luxury spa", es: "Disfruta de un día de relajación en nuestro spa de lujo" },
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      price: 50.00, price_type: "per_person" as const, requires_date_selection: false, allows_multiple_dates: false,
      max_quantity: 10, popular: false, active: true, valid_from: undefined, valid_until: undefined, sort_order: 2,
      metadata: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  ];

  // Transform data
  const transformedRooms = useMemo(() => transformRoomTypesToCompact(safeRoomTypes, currentLanguage), [safeRoomTypes, currentLanguage]);
  const transformedCustomizations = useMemo(() => transformCustomizationToCompact(safeCustomizationOptions, currentLanguage), [safeCustomizationOptions, currentLanguage]);
  const transformedOffers = useMemo(() => transformOffersToCompact(safeSpecialOffers, currentLanguage), [safeSpecialOffers, currentLanguage]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading content. Please try again later.</div>;
  }

  const currentRoom = transformedRooms[currentRoomIndex];
  const currentCustomization = transformedCustomizations[currentCustomizationIndex];
  const currentOffer = transformedOffers[currentOfferIndex];

  return (
    <div className="flex flex-row h-[calc(100vh-300px)] gap-4 overflow-hidden">
      {/* Row 1: Room Upgrades */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Room Upgrades</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              {currentRoomIndex + 1}/{transformedRooms.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRoomIndex(Math.max(0, currentRoomIndex - 1))}
              disabled={currentRoomIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRoomIndex(Math.min(transformedRooms.length - 1, currentRoomIndex + 1))}
              disabled={currentRoomIndex === transformedRooms.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {currentRoom && (
          <div className="flex flex-col gap-4 h-full">
            <div className="h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
              <img src={currentRoom.image} alt={currentRoom.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{currentRoom.name}</h4>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{currentRoom.description}</p>
              <div className="flex items-center gap-1 flex-wrap mb-4">
                {currentRoom.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-center border-t pt-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">€{currentRoom.price}</div>
              <div className="text-xs text-gray-500 mb-3">per night</div>
              <Button
                size="sm"
                onClick={() => {
                  onRoomSelected(currentRoom);
                  onShowAlert("success", `${currentRoom.name} selected`);
                }}
                className="w-full"
              >
                Select Room
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Room Customization */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Room Customization</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              {currentCustomizationIndex + 1}/{transformedCustomizations.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentCustomizationIndex(Math.max(0, currentCustomizationIndex - 1))}
              disabled={currentCustomizationIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentCustomizationIndex(Math.min(transformedCustomizations.length - 1, currentCustomizationIndex + 1))}
              disabled={currentCustomizationIndex === transformedCustomizations.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {currentCustomization && (
          <div className="h-full flex flex-col">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{currentCustomization.name}</h4>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {currentCustomization.options.map((option) => (
                <div
                  key={option.id}
                  className="flex flex-col p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{option.name}</span>
                      {option.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{option.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900">€{option.price}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        onRoomCustomizationChange(
                          currentCustomization.name,
                          option.id,
                          option.name,
                          option.price
                        );
                        onShowAlert("success", `${option.name} added`);
                      }}
                      className="px-3 py-1 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Special Offers */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Special Offers</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              {currentOfferIndex + 1}/{transformedOffers.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentOfferIndex(Math.max(0, currentOfferIndex - 1))}
              disabled={currentOfferIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentOfferIndex(Math.min(transformedOffers.length - 1, currentOfferIndex + 1))}
              disabled={currentOfferIndex === transformedOffers.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {currentOffer && (
          <div className="flex flex-col gap-4 h-full">
            <div className="h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
              <img src={currentOffer.image} alt={currentOffer.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-bold text-gray-900">{currentOffer.name}</h4>
                {currentOffer.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{currentOffer.description}</p>
              <div className="text-xs text-gray-500 capitalize mb-4">{currentOffer.priceType.replace('_', ' ')}</div>
            </div>
            <div className="text-center border-t pt-4">
              <div className="text-2xl font-bold text-green-600 mb-2">€{currentOffer.price}</div>
              <div className="text-xs text-gray-500 mb-3 capitalize">{currentOffer.priceType.replace('_', ' ')}</div>
              <Button
                size="sm"
                onClick={() => {
                  onOfferBook(currentOffer);
                  onShowAlert("success", `${currentOffer.name} booked`);
                }}
                className="w-full"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}