-- ABS Content Management Tables
-- Add these tables to support the ABS components with proper multilingual content

-- Room Types table - for ABS_RoomSelectionCarousel
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"en": "Supreme luxury with divine views", "es": "Lujo supremo con vistas divinas"}
  description JSONB NOT NULL, -- {"en": "Our contemporary Hard Rock...", "es": "Nuestras suites..."}
  base_price DECIMAL(10,2) NOT NULL,
  main_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}', -- ["24 Hours Room Service", "Balcony", "Landmark View"]
  capacity INTEGER DEFAULT 2,
  size_sqm INTEGER,
  category TEXT NOT NULL, -- "ROCK SUITE", "80S SUITE"
  rating DECIMAL(2,1) DEFAULT 4.5,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customization Options table - for ABS_RoomCustomization
CREATE TABLE customization_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- "Beds", "Room Features"
  name JSONB NOT NULL, -- {"en": "King Size Bed", "es": "Cama King Size"}
  description JSONB, -- {"en": "One extra-large king-sized bed", "es": "Una cama king extra grande"}
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_type TEXT NOT NULL DEFAULT 'per_night' CHECK (price_type IN ('per_night', 'per_person', 'per_stay')),
  icon TEXT, -- URL to icon image or emoji
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Special Offers table - for ABS_SpecialOffers
CREATE TABLE special_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_code TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"en": "All inclusive package", "es": "Paquete todo incluido"}
  description JSONB, -- {"en": "Enjoy unlimited access...", "es": "Disfruta acceso ilimitado..."}
  image TEXT NOT NULL, -- URL to offer image
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_type TEXT NOT NULL DEFAULT 'per_person' CHECK (price_type IN ('per_person', 'per_stay', 'per_night')),
  requires_date_selection BOOLEAN DEFAULT false,
  allows_multiple_dates BOOLEAN DEFAULT false,
  max_quantity INTEGER DEFAULT 10,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translations table - for global translations
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,
  language TEXT NOT NULL, -- 'en', 'es'
  value TEXT NOT NULL,
  category TEXT, -- optional category for grouping
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Create indexes for better performance
CREATE INDEX idx_room_types_active ON room_types(active);
CREATE INDEX idx_room_types_sort_order ON room_types(sort_order);
CREATE INDEX idx_room_types_base_price ON room_types(base_price);

CREATE INDEX idx_customization_options_category ON customization_options(category);
CREATE INDEX idx_customization_options_active ON customization_options(active);
CREATE INDEX idx_customization_options_sort_order ON customization_options(sort_order);

CREATE INDEX idx_special_offers_active ON special_offers(active);
CREATE INDEX idx_special_offers_sort_order ON special_offers(sort_order);
CREATE INDEX idx_special_offers_dates ON special_offers(valid_from, valid_until);

CREATE INDEX idx_translations_language ON translations(language);
CREATE INDEX idx_translations_category ON translations(category);
CREATE INDEX idx_translations_key_language ON translations(key, language);

-- Add updated_at triggers
CREATE TRIGGER update_room_types_updated_at 
  BEFORE UPDATE ON room_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customization_options_updated_at 
  BEFORE UPDATE ON customization_options 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_offers_updated_at 
  BEFORE UPDATE ON special_offers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at 
  BEFORE UPDATE ON translations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow read access to active content
CREATE POLICY "Anyone can view active room types" ON room_types
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view active customization options" ON customization_options
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view active special offers" ON special_offers
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view translations" ON translations
  FOR SELECT USING (true);

-- Enable real-time for content tables
ALTER PUBLICATION supabase_realtime ADD TABLE room_types;
ALTER PUBLICATION supabase_realtime ADD TABLE customization_options;
ALTER PUBLICATION supabase_realtime ADD TABLE special_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE translations;

-- Insert sample data matching ABS structure
INSERT INTO room_types (room_code, name, description, base_price, main_image, images, amenities, category, rating, sort_order) VALUES
('supreme-luxury', 
 '{"en": "Supreme luxury with divine views", "es": "Lujo supremo con vistas divinas"}'::jsonb,
 '{"en": "Our contemporary Hard Rock Ibiza Suites perfectly capture the authenticity and irreverence of rock ''n'' roll with the sensuality and...", "es": "Nuestras suites contemporáneas Hard Rock Ibiza capturan perfectamente la autenticidad e irreverencia del rock and roll con la sensualidad y..."}'::jsonb,
 89.00,
 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
 ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
 ARRAY['24 Hours Room Service', 'Balcony', 'Landmark View', 'Coffee Machine', 'King Size Bed'],
 'ROCK SUITE',
 4.8,
 1),

('80s-nostalgia', 
 '{"en": "80s nostalgia unleashed", "es": "Nostalgia de los 80 desatada"}'::jsonb,
 '{"en": "60 square-meter space with bold colors, vibrant pop music, cassettes with 80s music and vintage decor...", "es": "Espacio de 60 metros cuadrados con colores vibrantes, música pop, casetes con música de los 80 y decoración vintage..."}'::jsonb,
 120.00,
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
 ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
 ARRAY['Coffee Machine', 'King Size Bed', '80s Themed Decor', 'Music System', 'City View'],
 '80S SUITE',
 4.7,
 2);

INSERT INTO customization_options (option_code, category, name, description, price, price_type, popular, sort_order) VALUES
('twin-beds', 'Beds', 
 '{"en": "2 x Twin Beds", "es": "2 x Camas Individuales"}'::jsonb,
 '{"en": "Two separate single beds", "es": "Dos camas individuales separadas"}'::jsonb,
 0.00, 'per_night', false, 1),

('king-bed', 'Beds',
 '{"en": "King Size Bed", "es": "Cama King Size"}'::jsonb,
 '{"en": "One extra-large king-sized bed", "es": "Una cama king extra grande"}'::jsonb,
 5.00, 'per_night', true, 2),

('sofa-bed', 'Beds',
 '{"en": "Sofa Bed - Single", "es": "Sofá Cama - Individual"}'::jsonb,
 '{"en": "Single sofa bed for additional sleeping space", "es": "Sofá cama individual para espacio de descanso adicional"}'::jsonb,
 2.00, 'per_night', false, 3);

INSERT INTO special_offers (offer_code, name, description, image, price, price_type, popular, sort_order) VALUES
('all-inclusive', 
 '{"en": "All inclusive package", "es": "Paquete todo incluido"}'::jsonb,
 '{"en": "Enjoy unlimited access to all amenities, meals and beverages.", "es": "Disfruta acceso ilimitado a todas las comodidades, comidas y bebidas."}'::jsonb,
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
 50.00, 'per_person', true, 1),

('spa-access',
 '{"en": "Spa Access", "es": "Acceso al Spa"}'::jsonb,
 '{"en": "Enjoy a day of relaxation at our luxury spa - select your preferred date.", "es": "Disfruta de un día de relajación en nuestro spa de lujo - selecciona tu fecha preferida."}'::jsonb,
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
 50.00, 'per_person', false, 2),

('airport-transfer',
 '{"en": "Airport Transfer", "es": "Traslado al Aeropuerto"}'::jsonb,
 '{"en": "Convenient transportation to and from the airport (uses reservation person count).", "es": "Transporte conveniente hacia y desde el aeropuerto (usa el conteo de personas de la reserva)."}'::jsonb,
 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',
 35.00, 'per_person', false, 3);

-- Insert common translations
INSERT INTO translations (key, language, value, category) VALUES
('chooseYourSuperiorRoomLabel', 'en', 'Choose your Superior Room!', 'ui'),
('chooseYourSuperiorRoomLabel', 'es', '¡Elige tu Habitación Superior!', 'ui'),
('customizeYourStayTitle', 'en', 'Customize Your Stay', 'ui'),
('customizeYourStayTitle', 'es', 'Personaliza tu Estancia', 'ui'),
('enhanceYourStayLabel', 'en', 'Enhance your stay', 'ui'),
('enhanceYourStayLabel', 'es', 'Mejora tu estancia', 'ui'),
('selectRoomDescription', 'en', 'Choose from our selection of premium rooms and suites', 'ui'),
('selectRoomDescription', 'es', 'Elige de nuestra selección de habitaciones y suites premium', 'ui'),
('customizeDescription', 'en', 'Personalize your room for the perfect experience', 'ui'),
('customizeDescription', 'es', 'Personaliza tu habitación para la experiencia perfecta', 'ui'),
('offersDescription', 'en', 'Enhance your stay with these exclusive offers', 'ui'),
('offersDescription', 'es', 'Mejora tu estancia con estas ofertas exclusivas', 'ui'),
('bookNow', 'en', 'Book Now', 'ui'),
('bookNow', 'es', 'Reservar Ahora', 'ui'),
('select', 'en', 'UPGRADE NOW', 'ui'),
('learnMore', 'en', 'Learn More', 'ui'),
('selected', 'en', 'Selected', 'ui'),
('perNight', 'en', 'night', 'ui'),
('priceInfo', 'en', 'Price includes all taxes and fees', 'ui'),
('upgradeNow', 'en', 'UPGRADE NOW', 'ui'),
('remove', 'en', 'Remove', 'ui'),
('noRoomsAvailable', 'en', 'No rooms available', 'ui'),
('instantConfirmation', 'en', 'Instant Confirmation', 'ui'),
('commission', 'en', 'Commission', 'ui'),
('total', 'en', 'Total', 'ui'),
('previousRoom', 'en', 'Previous room', 'ui'),
('nextRoom', 'en', 'Next room', 'ui'),
('goToRoom', 'en', 'Go to room {index}', 'ui'),
('previousImage', 'en', 'Previous image', 'ui'),
('nextImage', 'en', 'Next image', 'ui'),
('viewImage', 'en', 'View image {index}', 'ui'),
('perStay', 'en', 'per stay', 'ui'),
('perPerson', 'en', 'per person', 'ui'),
('numberOfPersons', 'en', 'Number of persons', 'ui'),
('numberOfNights', 'en', 'Number of nights', 'ui'),
('added', 'en', 'Added', 'ui'),
('popular', 'en', 'Popular', 'ui'),
('personsTooltip', 'en', 'Select how many people will use this service', 'ui'),
('person', 'en', 'person', 'ui'),
('nightsTooltip', 'en', 'Select the number of nights for this service', 'ui'),
('night', 'en', 'night', 'ui'),
('persons', 'en', 'persons', 'ui'),
('nights', 'en', 'nights', 'ui'),
('removeOffer', 'en', 'Remove from List', 'ui'),
('decreaseQuantity', 'en', 'Decrease quantity', 'ui'),
('increaseQuantity', 'en', 'Increase quantity', 'ui'),
('selectDate', 'en', 'Select Date', 'ui'),
('selectDateTooltip', 'en', 'Choose the date for this service', 'ui'),
('dateRequired', 'en', 'Date selection required', 'ui'),
('selectDates', 'en', 'Select Dates', 'ui'),
('selectDatesTooltip', 'en', 'Choose dates for this service', 'ui'),
('availableDates', 'en', 'Available Dates', 'ui'),
('noAvailableDates', 'en', 'No available dates', 'ui'),
('clear', 'en', 'CLEAR', 'ui'),
('done', 'en', 'DONE', 'ui'),
('multipleDatesRequired', 'en', 'Multiple dates selection required', 'ui'),
('loadingOffers', 'en', 'Loading special offers...', 'ui');