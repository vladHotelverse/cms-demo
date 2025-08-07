"use client";

import React, { useState, useMemo } from "react";
import { ABS_RoomSelectionCarousel } from "@/components/features/booking-system/ABS_RoomSelectionCarousel";
import { ABS_RoomCustomization } from "@/components/features/booking-system/ABS_RoomCustomization";
import { ABS_SpecialOffers } from "@/components/features/booking-system/ABS_SpecialOffers";
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
  nights?: number;
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
    const roomName = getMultilingualValue(room.title, "Unnamed Room");
    const roomDescription = getMultilingualValue(room.description, "Comfortable room with modern amenities");
    const roomPrice = Number(room.base_price) || 0;
    const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];
    const roomImages = room.images && room.images.length > 0 ? room.images : [room.main_image];
    
    
    return {
      id: String(room.id),
      title: roomName,
      roomType: room.room_type,
      description: roomDescription,
      amenities: roomAmenities,
      price: roomPrice,
      oldPrice: roomPrice > 0 ? Math.round(roomPrice * 1.2) : undefined,
      images: roomImages,
      // Additional properties for backward compatibility
      name: roomName,
      type: room.room_type,
      features: roomAmenities,
      priceRange: `€${roomPrice} - €${Math.round(roomPrice * 1.3)}`,
      highlights: room.rating && room.rating > 4.5 ? ["Best Value"] : [],
      image: room.main_image,
      availability: "Instant Confirmation",
      category: room.room_type,
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
  
  
  options.forEach(option => {
    const category = option.category || "Other";
    const optionName = getMultilingualValue(option.name || {}, "Option");
    const optionDescription = getMultilingualValue(option.description || {}, `${optionName} upgrade`);
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


  // Create sections array with proper structure for ABS_RoomCustomization
  // IMPORTANT: section.key must match the keys in sectionOptions exactly!
  const sections = Object.keys(groupedOptions).map((category, index) => ({
    name: category,
    title: category,  // Add required title property
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
    
    const offerName = getMultilingualValue(offer.title || {}, "Special Offer");
    const offerDescription = getMultilingualValue(offer.description || {}, "");
    // Handle price which might come as string from Supabase DECIMAL field
    // Check both base_price and price fields (ABS database uses base_price)
    const rawPrice = (offer as any).base_price || offer.price;
    const offerPrice = rawPrice !== null && rawPrice !== undefined 
      ? (typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice))
      : 0;
    const offerImage = offer.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop";
    
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
  nights: propNights,
}: ReservationBlocksSectionProps) {
  const { currentLanguage } = useLanguage();
  const { roomTypes, customizationOptions, specialOffers, loading, error } = useReservationContent(currentLanguage);

  // Helper function to get ABS translations
  const getABSTranslation = (key: string): string => {
    const lang = currentLanguage === "es" ? "es" : "en";
    return (absTranslations as any)[lang][key] || key;
  };

  // Use data directly from Supabase
  const safeRoomTypes = roomTypes || [];
  const safeCustomizationOptions = customizationOptions || [];
  const safeSpecialOffers = specialOffers || [];
  
  // Get nights from props, default to 1
  const nights = propNights || 1;

  // Transform data for ABS components
  const transformedRoomOptions = useMemo(
    () => {
      const transformed = transformRoomTypesToABS(safeRoomTypes, currentLanguage);
      return transformed;
    },
    [safeRoomTypes, currentLanguage],
  );

  const { sections: customizationSections, sectionOptions } = useMemo(
    () => {
      const result = transformCustomizationOptionsToABS(safeCustomizationOptions, currentLanguage);
      return result;
    },
    [safeCustomizationOptions, currentLanguage],
  );

  const transformedOffers = useMemo(
    () => {
      const transformed = transformSpecialOffersToABS(safeSpecialOffers, currentLanguage);
      
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
        return {};
      }
      
      transformedOffers.forEach(offer => {
        // Validate offer ID
        if (typeof offer.id !== 'number' || Number.isNaN(offer.id)) {
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
      
      
      return selections;
    },
    [transformedOffers],
  );

  if (loading) {
    return (
      <div className="flex flex-row gap-6 h-full pb-12">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg flex-1"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg flex-1"></div>
        <div className="animate-pulse bg-gray-200 h-48 rounded-lg flex-1"></div>
      </div>
    );
  }

  if (error) {
    console.error("Database error:", error);
    onShowAlert("error", "Failed to load content from database");
    return (
      <div className="flex flex-row gap-6 h-full pb-12">
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center text-red-600 flex-1">
          Error loading content. Please try again later.
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center text-red-600 flex-1">
          Error loading content. Please try again later.
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center text-red-600 flex-1">
          Error loading content. Please try again later.
        </div>
      </div>
    );
  }

  // Check if we have no data from Supabase
  if (!roomTypes || roomTypes.length === 0) {
    return (
      <div className="flex flex-row gap-6 h-full pb-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 flex-1">
          No room types available. Please add room types in the CMS.
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 flex-1">
          No customization options available.
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 flex-1">
          No special offers available.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 pb-12">
      {/* Room Selection Section - Card Layout */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 h-[max(650px,calc(100vh-350px))]">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {getABSTranslation("chooseYourSuperiorRoomLabel") || "Room Upgrades"}
          </h2>
          <p className="text-xs text-gray-600">
            {getABSTranslation("selectRoomDescription") || "Choose from our selection of premium rooms and suites"}
          </p>
        </div>
        <div className="p-0 h-full overflow-hidden">
          <ABS_RoomSelectionCarousel
              roomOptions={transformedRoomOptions}
              onRoomSelected={onRoomSelected}
              initialSelectedRoom={selectedRoom}
              nights={nights}
              translations={{
                learnMoreText: getABSTranslation("learnMore") || "Learn More",
                selectText: getABSTranslation("select") || "SELECCIONAR",
                selectedText: getABSTranslation("selected") || "Selected",
                nightText: getABSTranslation("perNight") || "night",
                currencySymbol: "€",
                priceInfoText: getABSTranslation("priceInfo") || "Price includes all taxes and fees",
                upgradeNowText: getABSTranslation("upgradeNow") || "UPGRADE NOW",
                removeText: getABSTranslation("remove") || "Remove",
                discountBadgeText: "-{percentage}%",
                noRoomsAvailableText: getABSTranslation("noRoomsAvailable") || "No rooms available",
                instantConfirmationText: getABSTranslation("instantConfirmation") || "Instant Confirmation",
                commissionText: getABSTranslation("commission") || "Commission",
                totalAmountText: getABSTranslation("total") || "Total",
                navigationLabels: {
                  previousRoom: getABSTranslation("previousRoom") || "Previous room",
                  nextRoom: getABSTranslation("nextRoom") || "Next room",
                  goToRoom: getABSTranslation("goToRoom") || "Go to room {index}",
                  previousImage: getABSTranslation("previousImage") || "Previous image",
                  nextImage: getABSTranslation("nextImage") || "Next image",
                  viewImage: getABSTranslation("viewImage") || "View image {index}",
                },
              }}
            />
        </div>
      </div>

      {/* Room Customization Section - Card Layout */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Room Customization
          </h2>
          <p className="text-xs text-gray-600">
            Personalize your room for the perfect experience
          </p>
        </div>
        <div className="px-4">
          <ABS_RoomCustomization
              title="Room Customization"
              subtitle="Personalize your room for the perfect experience"
              sections={customizationSections}
              sectionOptions={sectionOptions}
              initialSelections={roomCustomizations}
              onCustomizationChange={onRoomCustomizationChange}
              nights={nights}
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
        </div>
      </div>

      {/* Special Offers Section - Card Layout */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 h-[max(650px,calc(100vh-350px))]">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {getABSTranslation("enhanceYourStayLabel") || "Special Offers"}
          </h2>
          <p className="text-xs text-gray-600">
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
            <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  {getABSTranslation("loadingOffers") || "Loading special offers..."}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}