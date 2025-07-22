import type { EquipmentItem, EquipmentCategory, Language } from '@/types/equipment';

export const equipmentCategories: EquipmentCategory[] = [
  { id: 1, name: "Habitación" },
  { id: 2, name: "Baño" },
  { id: 3, name: "Tecnología" },
  { id: 4, name: "Comodidades" },
  { id: 5, name: "Servicios" },
  { id: 6, name: "Vista" },
  { id: 7, name: "Accesibilidad" },
];

export const equipmentItems: EquipmentItem[] = [
  { id: 1, name: "Aire Acondicionado", category: "Habitación" },
  { id: 2, name: "Calefacción", category: "Habitación" },
  { id: 3, name: "Minibar", category: "Habitación" },
  { id: 4, name: "Caja Fuerte", category: "Habitación" },
  { id: 5, name: "Balcón/Terraza", category: "Habitación" },
  { id: 6, name: "Jacuzzi", category: "Baño" },
  { id: 7, name: "Secador de Pelo", category: "Baño" },
  { id: 8, name: "Albornoces", category: "Baño" },
  { id: 9, name: "Artículos de Aseo", category: "Baño" },
  { id: 10, name: "Televisión", category: "Tecnología" },
  { id: 11, name: "WiFi Gratuito", category: "Tecnología" },
  { id: 12, name: "Teléfono", category: "Tecnología" },
  { id: 13, name: "Sistema de Sonido", category: "Tecnología" },
  { id: 14, name: "Servicio de Habitaciones", category: "Servicios" },
  { id: 15, name: "Servicio de Limpieza", category: "Servicios" },
  { id: 16, name: "Lavandería", category: "Servicios" },
  { id: 17, name: "Vista al Mar", category: "Vista" },
  { id: 18, name: "Vista a la Piscina", category: "Vista" },
  { id: 19, name: "Vista al Jardín", category: "Vista" },
  { id: 20, name: "Acceso para Sillas de Ruedas", category: "Accesibilidad" },
  { id: 21, name: "Baño Adaptado", category: "Accesibilidad" },
];

export const languages: Language[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export const initialCategoryEquipment = {
  "Habitación": [1, 2, 3, 4, 5],
  "Baño": [6, 7, 8, 9],
  "Tecnología": [10, 11, 12, 13],
  "Servicios": [14, 15, 16],
  "Vista": [17, 18, 19],
  "Accesibilidad": [20, 21],
};