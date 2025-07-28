"use client";

import React, { useState, useMemo } from "react";
import { ABS_RoomSelectionCarousel } from "@/components/ABS_RoomSelectionCarousel";
import { ABS_RoomCustomization } from "@/components/ABS_RoomCustomization";
import { ABS_SpecialOffers } from "@/components/ABS_SpecialOffers";
import { useLanguage } from "@/contexts/language-context";
import { useReservationContent } from "@/hooks/useSupabaseContent";
import type { RoomType, CustomizationOption, SpecialOffer } from "@/hooks/useSupabaseContent";

// Import ABS translations
import { absTranslations } from "@/locales/abs-translations";

interface ReservationBlocksSectionProps {
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

// Transform functions to convert Supabase data to ABS component format
function transformRoomTypesToABS(roomTypes: RoomType[], currentLanguage: string = 'en') {
  return roomTypes.map(room => {
    // Helper function to extract multilingual string value
    const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return value[currentLanguage] || value['en'] || value['es'] || fallback;
      }
      return fallback;
    };

    // Extract values using proper multilingual support
    const roomName = getMultilingualValue(room.name, "Room");
    const roomDescription = getMultilingualValue(room.description, "Comfortable room with modern amenities");
    const roomPrice = Number(room.base_price) || 0;
    const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];
    const roomImages = room.images && room.images.length > 0 ? room.images : [room.main_image];
    
    console.log(`Processing room: ${roomName}, price: ${roomPrice}, amenities:`, roomAmenities);
    
    return {
      id: String(room.id),
      title: roomName,
      roomType: room.category,
      description: roomDescription,
      amenities: roomAmenities,
      price: roomPrice,
      oldPrice: roomPrice > 0 ? Math.round(roomPrice * 1.2) : undefined,
      images: roomImages,
      // Additional properties for backward compatibility
      name: roomName,
      type: room.category,
      features: roomAmenities,
      priceRange: `€${roomPrice} - €${Math.round(roomPrice * 1.3)}`,
      highlights: room.rating && room.rating > 4.5 ? ["Best Value"] : [],
      image: room.main_image,
      availability: "Instant Confirmation",
      category: room.category,
      rating: Number(room.rating) || 4.5,
      basePrice: roomPrice,
    };
  });
}

function transformCustomizationOptionsToABS(options: CustomizationOption[], currentLanguage: string = 'en') {
  const groupedOptions: { [category: string]: any } = {};
  
  // Helper function to extract multilingual string value
  const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[currentLanguage] || value['en'] || value['es'] || fallback;
    }
    return fallback;
  };
  
  console.log("Processing customization options for ABS_RoomCustomization:", options);
  
  options.forEach(option => {
    const category = option.category || "Other";
    const optionName = getMultilingualValue(option.name, "Option");
    const optionDescription = getMultilingualValue(option.description, `${optionName} upgrade`);
    const optionPrice = Number(option.price) || 0;
    const priceType = option.price_type || 'per_night';
    
    if (!groupedOptions[category]) {
      groupedOptions[category] = {
        icon: category.toLowerCase().includes('bed') ? "bed" : 
              category.toLowerCase().includes('view') ? "city-view" :
              category.toLowerCase().includes('feature') ? "sparkles" : 
              category.toLowerCase().includes('access') ? "accessibility" : "layout",
        items: []
      };
    }
    
    // Structure the option data exactly as ABS_RoomCustomization expects
    groupedOptions[category].items.push({
      id: String(option.id),
      label: optionName, // ✅ ABS expects 'label' not 'name'
      description: optionDescription,
      price: optionPrice, // Keep as number for calculations
      icon: option.icon || (category.toLowerCase().includes('bed') ? "bed" : 
                           category.toLowerCase().includes('view') ? "city-view" : 
                           category.toLowerCase().includes('access') ? "accessibility" : "sparkles"),
      popular: Boolean(option.popular),
      available: true,
      selected: false, // Default selection state
    });
  });

  console.log("Grouped customization options by category:", groupedOptions);

  // Create sections array with proper structure for ABS_RoomCustomization
  // IMPORTANT: section.key must match the keys in sectionOptions exactly!
  const sections = Object.keys(groupedOptions).map((category, index) => ({
    name: category,
    key: category, // ✅ Use category name directly to match sectionOptions keys
    id: `section-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    icon: groupedOptions[category].icon,
    collapsible: true, // Enable collapsible sections
    expanded: index === 0, // First section expanded by default
  }));
  
  // Transform sectionOptions to use category names as keys and extract items arrays
  const sectionOptions: Record<string, any[]> = {};
  Object.keys(groupedOptions).forEach(category => {
    sectionOptions[category] = groupedOptions[category].items; // ✅ Extract items array
  });

  console.log("Final sections for ABS_RoomCustomization:", sections);
  console.log("Final sectionOptions for ABS_RoomCustomization:", sectionOptions);

  return { sections, sectionOptions };
}

function transformSpecialOffersToABS(offers: SpecialOffer[], currentLanguage: string = 'en') {
  // Helper function to extract multilingual string value
  const getMultilingualValue = (value: Record<string, string> | string, fallback: string = ""): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[currentLanguage] || value['en'] || value['es'] || fallback;
    }
    return fallback;
  };

  // Use a more predictable ID generation approach
  return offers.map((offer, index) => {
    // Generate a consistent numeric ID based on the original string ID
    let numericId: number;
    
    if (offer.id && typeof offer.id === 'string') {
      // Create a hash-like numeric ID from the string ID
      let hash = 0;
      for (let i = 0; i < offer.id.length; i++) {
        const char = offer.id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      numericId = Math.abs(hash) % 100000; // Ensure it's positive and reasonable size
    } else if (offer.id && typeof offer.id === 'number') {
      numericId = offer.id;
    } else {
      // Fallback: use index-based ID
      numericId = 1000 + index;
    }
    
    // Ensure the ID is positive and not zero
    if (numericId <= 0) {
      numericId = 1000 + index;
    }
    
    const offerName = getMultilingualValue(offer.name, "Special Offer");
    const offerDescription = getMultilingualValue(offer.description, "");
    const offerPrice = Number(offer.price) || 0;
    const offerImage = offer.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop";
    
    console.log(`Transforming offer "${offerName}" with ID ${numericId}, price: ${offerPrice}, image: ${offerImage}`);
    
    return {
      id: numericId,
      title: offerName,
      description: offerDescription,
      price: offerPrice,
      type: mapPriceTypeToABS(offer.price_type || 'per_stay'),
      image: offerImage,
      requiresDateSelection: Boolean(offer.requires_date_selection),
      allowsMultipleDates: Boolean(offer.allows_multiple_dates),
      featured: Boolean(offer.popular || false),
    };
  });
}

// Helper function to map our price types to ABS types
function mapPriceTypeToABS(priceType: string): 'perStay' | 'perPerson' | 'perNight' {
  switch (priceType) {
    case 'per_person':
      return 'perPerson';
    case 'per_night':
      return 'perNight';
    case 'per_stay':
    default:
      return 'perStay';
  }
}

export default function ReservationBlocksSection({
  selectedRoom,
  roomCustomizations,
  bookedOffers,
  onRoomSelected,
  onRoomCustomizationChange,
  onOfferBook,
  onShowAlert,
}: ReservationBlocksSectionProps) {
  const { currentLanguage } = useLanguage();
  const { roomTypes, customizationOptions, specialOffers, loading, error } = useReservationContent(currentLanguage);

  // Helper function to get ABS translations
  const getABSTranslation = (key: string): string => {
    const lang = currentLanguage === "es" ? "es" : "en";
    return (absTranslations as any)[lang][key] || key;
  };

  // Provide fallback data if Supabase data is not available - matching ABS structure exactly
  const safeRoomTypes = roomTypes && roomTypes.length > 0 ? roomTypes : [
    {
      id: "supreme-luxury-suite",
      room_code: "supreme-luxury",
      name: {
        en: "Supreme luxury with divine views",
        es: "Lujo supremo con vistas divinas"
      },
      description: {
        en: "Our contemporary Hard Rock Ibiza Suites perfectly capture the authenticity and irreverence of rock 'n' roll with the sensuality and...",
        es: "Nuestras suites contemporáneas Hard Rock Ibiza capturan perfectamente la autenticidad e irreverencia del rock and roll con la sensualidad y..."
      },
      base_price: 89,
      main_image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
      amenities: ["24 Hours Room Service", "Balcony", "Landmark View", "Coffee Machine", "King Size Bed"],
      capacity: 2,
      size_sqm: 60,
      category: "ROCK SUITE",
      rating: 4.8,
      active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "nostalgia-suite",
      room_code: "80s-nostalgia",
      name: {
        en: "80s nostalgia unleashed",
        es: "Nostalgia de los 80 desatada"
      },
      description: {
        en: "60 square-meter space with bold colors, vibrant pop music, cassettes with 80s music and vintage decor...",
        es: "Espacio de 60 metros cuadrados con colores vibrantes, música pop, casetes con música de los 80 y decoración vintage..."
      },
      base_price: 120,
      main_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
      amenities: ["Coffee Machine", "King Size Bed", "80s Themed Decor", "Music System", "City View"],
      capacity: 2,
      size_sqm: 60,
      category: "80S SUITE",
      rating: 4.7,
      active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
  
  console.log("Raw customization options from database:", customizationOptions);
  
  const safeCustomizationOptions = customizationOptions && customizationOptions.length > 0 ? customizationOptions : [
    {
      id: "twin-beds",
      option_code: "twin-beds",
      category: "Beds",
      name: {
        en: "2 x Twin Beds",
        es: "2 x Camas Individuales"
      },
      description: {
        en: "Two separate single beds",
        es: "Dos camas individuales separadas"
      },
      price: 0.00,
      price_type: "per_night" as const,
      icon: "bed-twin",
      popular: false,
      active: true,
      sort_order: 1,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "king-bed",
      option_code: "king-bed",
      category: "Beds",
      name: {
        en: "King Size Bed",
        es: "Cama King Size"
      },
      description: {
        en: "One extra-large king-sized bed",
        es: "Una cama king extra grande"
      },
      price: 5.00,
      price_type: "per_night" as const,
      icon: "bed-king",
      popular: true,
      active: true,
      sort_order: 2,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sofa-bed",
      option_code: "sofa-bed",
      category: "Beds",
      name: {
        en: "Sofa Bed - Single",
        es: "Sofá Cama - Individual"
      },
      description: {
        en: "Single sofa bed for additional sleeping space",
        es: "Sofá cama individual para espacio de descanso adicional"
      },
      price: 2.00,
      price_type: "per_night" as const,
      icon: "sofa",
      popular: false,
      active: true,
      sort_order: 3,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
  
  const safeSpecialOffers = specialOffers && specialOffers.length > 0 ? specialOffers : [
    {
      id: "all-inclusive-package",
      offer_code: "all-inclusive",
      name: {
        en: "All inclusive package",
        es: "Paquete todo incluido"
      },
      description: {
        en: "Enjoy unlimited access to all amenities, meals and beverages.",
        es: "Disfruta acceso ilimitado a todas las comodidades, comidas y bebidas."
      },
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      price: 50.00,
      price_type: "per_person" as const,
      requires_date_selection: false,
      allows_multiple_dates: false,
      max_quantity: 10,
      popular: true,
      active: true,
      valid_from: undefined,
      valid_until: undefined,
      sort_order: 1,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "spa-access",
      offer_code: "spa-access",
      name: {
        en: "Spa Access",
        es: "Acceso al Spa"
      },
      description: {
        en: "Enjoy a day of relaxation at our luxury spa - select your preferred date.",
        es: "Disfruta de un día de relajación en nuestro spa de lujo - selecciona tu fecha preferida."
      },
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      price: 50.00,
      price_type: "per_person" as const,
      requires_date_selection: false,
      allows_multiple_dates: false,
      max_quantity: 10,
      popular: false,
      active: true,
      valid_from: undefined,
      valid_until: undefined,
      sort_order: 2,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "airport-transfer",
      offer_code: "airport-transfer",
      name: {
        en: "Airport Transfer",
        es: "Traslado al Aeropuerto"
      },
      description: {
        en: "Convenient transportation to and from the airport (uses reservation person count).",
        es: "Transporte conveniente hacia y desde el aeropuerto (usa el conteo de personas de la reserva)."
      },
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
      price: 35.00,
      price_type: "per_person" as const,
      requires_date_selection: false,
      allows_multiple_dates: false,
      max_quantity: 10,
      popular: false,
      active: true,
      valid_from: undefined,
      valid_until: undefined,
      sort_order: 3,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // Transform data for ABS components
  const transformedRoomOptions = useMemo(
    () => {
      const transformed = transformRoomTypesToABS(safeRoomTypes, currentLanguage);
      console.log("Original room types:", safeRoomTypes);
      console.log("Transformed room options:", transformed);
      return transformed;
    },
    [safeRoomTypes, currentLanguage],
  );

  const { sections: customizationSections, sectionOptions } = useMemo(
    () => {
      console.log("About to transform customization options:", safeCustomizationOptions);
      const result = transformCustomizationOptionsToABS(safeCustomizationOptions, currentLanguage);
      console.log("Customization transformation result:", result);
      return result;
    },
    [safeCustomizationOptions, currentLanguage],
  );

  const transformedOffers = useMemo(
    () => {
      const transformed = transformSpecialOffersToABS(safeSpecialOffers, currentLanguage);
      console.log("Original special offers:", safeSpecialOffers);
      console.log("Transformed special offers:", transformed);
      
      // Check for duplicate IDs
      const ids = transformed.map(offer => offer.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        console.error("Duplicate offer IDs found:", duplicates);
      }
      
      return transformed;
    },
    [safeSpecialOffers, currentLanguage],
  );

  // Create initial selections for all offers (with quantity 0)
  const initialOfferSelections = useMemo(
    () => {
      const selections: Record<number, { 
        quantity: number; 
        persons: number; 
        nights: number;
        selectedDate?: Date;
        selectedDates?: Date[];
        startDate?: Date;
        endDate?: Date;
      }> = {};
      
      // First, ensure we have valid transformed offers
      if (!transformedOffers || transformedOffers.length === 0) {
        console.log("No transformed offers available yet");
        return {};
      }
      
      transformedOffers.forEach(offer => {
        // Validate offer ID
        if (typeof offer.id !== 'number' || isNaN(offer.id)) {
          console.warn("Invalid offer ID:", offer.id, "for offer:", offer);
          return;
        }
        
        // Ensure every property is defined to match OfferSelection interface
        selections[offer.id] = {
          quantity: 0,
          persons: offer.type === 'perPerson' ? 1 : 1,
          nights: offer.type === 'perNight' ? 1 : 1,
          selectedDate: undefined,
          selectedDates: undefined,
          startDate: undefined,
          endDate: undefined,
        };
      });
      
      console.log("Initial offer selections created:", selections);
      console.log("Transformed offers IDs:", transformedOffers.map(o => o.id));
      
      return selections;
    },
    [transformedOffers],
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    console.error("Supabase error:", error);
    onShowAlert("error", "Failed to load content from database");
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center py-8 text-red-600">
          Error loading content. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Room Selection Section - Matching ABS Layout */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getABSTranslation("chooseYourSuperiorRoomLabel") || "Choose your Superior Room!"}
          </h2>
          <p className="text-gray-600">
            {getABSTranslation("selectRoomDescription") || "Choose from our selection of premium rooms and suites"}
          </p>
        </div>
        <ABS_RoomSelectionCarousel
            roomOptions={transformedRoomOptions}
            onRoomSelected={onRoomSelected}
            initialSelectedRoom={selectedRoom}
            showPriceSlider={false}
            translations={{
              learnMoreText: getABSTranslation("learnMore") || "Learn More",
              selectText: getABSTranslation("select") || "UPGRADE NOW",
              selectedText: getABSTranslation("selected") || "Selected",
              nightText: getABSTranslation("perNight") || "night",
              currencySymbol: "€",
              priceInfoText: getABSTranslation("priceInfo") || "Price includes all taxes and fees",
              makeOfferText: getABSTranslation("makeOffer") || "Make Offer",
              availabilityText: getABSTranslation("availabilityNotice") || "Instant Confirmation",
              proposePriceText: getABSTranslation("proposePriceText") || "Propose your price:",
              currencyText: "EUR",
              upgradeNowText: getABSTranslation("upgradeNow") || "UPGRADE NOW",
              removeText: getABSTranslation("remove") || "Remove",
              offerMadeText: getABSTranslation("offerMadeText") || "Offer made: {price} EUR per night",
              discountBadgeText: "-{percentage}%",
              noRoomsAvailableText: getABSTranslation("noRoomsAvailable") || "No rooms available",
              bidSubmittedText: getABSTranslation("bidSubmitted") || "Bid submitted",
              updateBidText: getABSTranslation("updateBid") || "Update bid",
              cancelBidText: getABSTranslation("cancel") || "Cancel",
              navigationLabels: {
                previousRoom: getABSTranslation("previousRoom") || "Previous room",
                nextRoom: getABSTranslation("nextRoom") || "Next room",
                previousRoomMobile: getABSTranslation("previousRoom") || "Previous room (mobile)",
                nextRoomMobile: getABSTranslation("nextRoom") || "Next room (mobile)",
                goToRoom: getABSTranslation("goToRoom") || "Go to room {index}",
                previousImage: getABSTranslation("previousImage") || "Previous image",
                nextImage: getABSTranslation("nextImage") || "Next image",
                viewImage: getABSTranslation("viewImage") || "View image {index}",
              },
            }}
          />
      </section>

      {/* Room Customization Section - Matching ABS Layout */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Customize Your Stay
          </h2>
          <p className="text-gray-600">
            Personalize your room for the perfect experience
          </p>
        </div>
        <ABS_RoomCustomization
            title=""
            subtitle=""
            sections={customizationSections}
            sectionOptions={sectionOptions}
            initialSelections={roomCustomizations}
            onCustomizationChange={onRoomCustomizationChange}
            texts={{
              pricePerNightText: "/night",
              selectText: "Add for", // ✅ No {price} placeholder - component adds price automatically
              selectedText: "Selected",
              featuresText: "Features",
              availableOptionsText: "Available Options",
              understood: "Understood",
              improveText: "Improve your room",
              addForPriceText: "Add for", // ✅ No {price} placeholder - component adds price automatically  
              removeText: "Remove",
              showMoreText: "Show more",
              showLessText: "Show less",
              optionDisabledText: "Option disabled",
              conflictWithText: "Conflicts with",
              keepCurrentText: "Keep current",
              switchToNewText: "Switch to new",
              conflictDialogTitle: "Selection Conflict",
              conflictDialogDescription: "This selection conflicts with your current choice",
            }}
          />
      </section>

      {/* Special Offers Section - Matching ABS Layout */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getABSTranslation("enhanceYourStayLabel") || "Enhance your stay"}
          </h2>
          <p className="text-gray-600">
            {getABSTranslation("offersDescription") || "Enhance your stay with these exclusive offers"}
          </p>
        </div>
          {transformedOffers.length > 0 && 
           Object.keys(initialOfferSelections).length > 0 && 
           transformedOffers.every(offer => initialOfferSelections[offer.id] !== undefined) ? (
            <ABS_SpecialOffers
              offers={transformedOffers}
              initialSelections={initialOfferSelections}
              onBookOffer={onOfferBook}
              currencySymbol="€"
              labels={{
                bookNow: getABSTranslation("bookNow") || "Book Now",
                total: getABSTranslation("total") || "Total",
                perStay: getABSTranslation("perStay") || "per stay",
                perPerson: getABSTranslation("perPerson") || "per person",
                perNight: getABSTranslation("perNight") || "per night",
                numberOfPersons: getABSTranslation("numberOfPersons") || "Number of persons",
                numberOfNights: getABSTranslation("numberOfNights") || "Number of nights",
                addedLabel: getABSTranslation("added") || "Added",
                popularLabel: getABSTranslation("popular") || "Popular",
                personsTooltip: getABSTranslation("personsTooltip") || "Select how many people will use this service",
                personsSingularUnit: getABSTranslation("person") || "person",
                personsPluralUnit: "",
                nightsTooltip: getABSTranslation("nightsTooltip") || "Select the number of nights for this service",
                nightsSingularUnit: getABSTranslation("night") || "night",
                nightsPluralUnit: "s",
                personSingular: getABSTranslation("person") || "person",
                personPlural: getABSTranslation("persons") || "persons",
                nightSingular: getABSTranslation("night") || "night",
                nightPlural: getABSTranslation("nights") || "nights",
                removeOfferLabel: getABSTranslation("removeOffer") || "Remove from List",
                decreaseQuantityLabel: getABSTranslation("decreaseQuantity") || "Decrease quantity",
                increaseQuantityLabel: getABSTranslation("increaseQuantity") || "Increase quantity",
                selectDateLabel: getABSTranslation("selectDate") || "Select Date",
                selectDateTooltip: getABSTranslation("selectDateTooltip") || "Choose the date for this service",
                dateRequiredLabel: getABSTranslation("dateRequired") || "Date selection required",
                selectDatesLabel: getABSTranslation("selectDates") || "Select Dates",
                selectDatesTooltip: getABSTranslation("selectDatesTooltip") || "Choose dates for this service",
                availableDatesLabel: getABSTranslation("availableDates") || "Available Dates",
                noAvailableDatesLabel: getABSTranslation("noAvailableDates") || "No available dates",
                clearDatesLabel: getABSTranslation("clear") || "CLEAR",
                confirmDatesLabel: getABSTranslation("done") || "DONE",
                dateSelectedLabel: getABSTranslation("selected") || "selected",
                multipleDatesRequiredLabel: getABSTranslation("multipleDatesRequired") || "Multiple dates selection required",
              }}
            />
          ) : (
            <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-gray-400 mb-3">
                  <svg className="mx-auto h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  {getABSTranslation("loadingOffers") || "Loading special offers..."}
                </p>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}