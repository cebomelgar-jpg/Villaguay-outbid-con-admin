export type CategoryId =
  | 'gastronomia'
  | 'estetica'
  | 'salud'
  | 'indumentaria'
  | 'oficios'
  | 'construccion'
  | 'automotor'
  | 'profesionales'
  | 'alojamiento'
  | 'mascotas';

export interface Subcategory {
  id: string;
  label: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  subcategories: Subcategory[];
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface SocialLinks {
  whatsapp: string;
  instagram: string;
  googleMaps?: string;
}

export type BusinessStatus = 'active' | 'suspended' | 'hidden';

export interface Business {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  bid: number;
  owner: string;
  address: string;
  image: string; // Main logo/cover image
  images: string[]; // Gallery images (up to 5)
  whatsapp: string;
  instagram: string;
  googleMaps?: string;
  slogan: string;
  description: string; // Extended description
  services: string[]; // Services/products list
  businessHours?: BusinessHours;
  socialLinks: SocialLinks;
  daysAtTop: number;
  clickCount: number;
  status: BusinessStatus;
}

export interface LiveEvent {
  id: string;
  message: string;
  timeAgo: string;
  category: CategoryId;
}

export const MIN_BID = 500;
export const MIN_INCREMENT = 500;
export const MERCADO_PAGO_LINK = 'https://link.mercadopago.com.ar/villaguayoutbid';
export const SUPPORT_WHATSAPP = 'https://wa.me/5493450000000';

export const categories: Category[] = [
  {
    id: 'gastronomia',
    label: 'Gastronomía & Salidas',
    emoji: '🍔',
    subcategories: [
      { id: 'rotiserias', label: 'Rotiserías & Comidas Rápidas' },
      { id: 'restaurantes', label: 'Restaurantes & Parrillas' },
      { id: 'bares', label: 'Bares & Cervecerías' },
      { id: 'cafeterias', label: 'Cafeterías & Repostería' },
      { id: 'catering', label: 'Eventos & Catering' },
    ],
  },
  {
    id: 'estetica',
    label: 'Estética & Cuidado Personal',
    emoji: '✂️',
    subcategories: [
      { id: 'peluquerias', label: 'Peluquerías & Barberías' },
      { id: 'centros_estetica', label: 'Centros de Estética' },
      { id: 'unas', label: 'Manicuría & Uñas' },
      { id: 'pestanas', label: 'Pestañas & Cejas' },
      { id: 'tatuajes', label: 'Tatuajes & Piercings' },
    ],
  },
  {
    id: 'salud',
    label: 'Salud & Fitness',
    emoji: '🏋️',
    subcategories: [
      { id: 'gimnasios', label: 'Gimnasios & CrossFit' },
      { id: 'canchas', label: 'Canchas & Deportes' },
      { id: 'dieteticas', label: 'Dietéticas' },
      { id: 'kinesiologia', label: 'Kinesiología & Masajes' },
      { id: 'consultorios', label: 'Consultorios Médicos & Odontología' },
      { id: 'clinicas', label: 'Clínicas & Laboratorios' },
    ],
  },
  {
    id: 'indumentaria',
    label: 'Indumentaria & Calzado',
    emoji: '👟',
    subcategories: [
      { id: 'ropa_fm', label: 'Ropa Femenina/Masculina' },
      { id: 'calzado', label: 'Calzado' },
      { id: 'lenceria', label: 'Lencería & Deportiva' },
      { id: 'infantil', label: 'Ropa Infantil' },
      { id: 'joyeria', label: 'Joyería & Accesorios' },
    ],
  },
  {
    id: 'oficios',
    label: 'Oficios & Servicio Técnico Hogar',
    emoji: '🛠️',
    subcategories: [
      { id: 'electricidad', label: 'Electricidad' },
      { id: 'refrigeracion', label: 'Refrigeración & Electrodomésticos' },
      { id: 'plomeria', label: 'Plomería' },
      { id: 'jardines', label: 'Jardinería & Piletas' },
      { id: 'cerrajeria', label: 'Cerrajería' },
      { id: 'pintura', label: 'Pintura & Limpieza' },
    ],
  },
  {
    id: 'construccion',
    label: 'Construcción & Ferretería',
    emoji: '🏗️',
    subcategories: [
      { id: 'corralones', label: 'Corralones' },
      { id: 'ferreterias', label: 'Ferreterías & Pinturerías' },
      { id: 'arquitectura', label: 'Arquitectura & Durlock' },
      { id: 'carpinteria', label: 'Carpintería & Herrería' },
    ],
  },
  {
    id: 'automotor',
    label: 'Automotor & Transporte',
    emoji: '🚗',
    subcategories: [
      { id: 'talleres', label: 'Talleres Mecánicos' },
      { id: 'gomerias', label: 'Gomerías' },
      { id: 'lavaderos', label: 'Lavaderos & Detailing' },
      { id: 'repuestos', label: 'Repuestos & Baterías' },
      { id: 'motos', label: 'Motos & Bicis' },
      { id: 'fletes', label: 'Fletes & Comisiones' },
    ],
  },
  {
    id: 'profesionales',
    label: 'Servicios Profesionales',
    emoji: '💼',
    subcategories: [
      { id: 'abogados', label: 'Abogados & Contadores' },
      { id: 'diseno', label: 'Diseño & Imprentas' },
      { id: 'inmobiliarias', label: 'Inmobiliarias' },
      { id: 'gestoria', label: 'Gestoría & Seguros' },
      { id: 'reparacion_cel', label: 'Reparación de Celulares/Computación' },
    ],
  },
  {
    id: 'alojamiento',
    label: 'Alojamientos & Turismo',
    emoji: '🏨',
    subcategories: [
      { id: 'hoteles', label: 'Hoteles & Hosterías' },
      { id: 'cabanas', label: 'Cabañas' },
      { id: 'quintas', label: 'Quintas para Eventos' },
    ],
  },
  {
    id: 'mascotas',
    label: 'Mascotas & Veterinaria',
    emoji: '🐾',
    subcategories: [
      { id: 'veterinarias', label: 'Veterinarias 24h' },
      { id: 'peluqueria_canina', label: 'Peluquería Canina' },
      { id: 'pet_shops', label: 'Pet Shops' },
    ],
  },
];

export const liveEvents: LiveEvent[] = [
  { id: 'e1', message: '🔥 Villaguay Outbid reinicia sus rankings — ¡Estrená tu categoría este mes!', timeAgo: 'hace 1h', category: 'gastronomia' },
  { id: 'e2', message: '📅 Ciclo mensual activo: del 1 al último día de cada mes. ¡Compite!', timeAgo: 'hace 2h', category: 'gastronomia' },
  { id: 'e3', message: '👑 Sé el primero en ocupar el #1 de tu rubro en Villaguay', timeAgo: 'hace 3h', category: 'estetica' },
];

export function isBusinessOpen(businessHours?: BusinessHours): boolean {
  if (!businessHours) return true; // Assume open if no hours specified

  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const hours = businessHours[currentDay as keyof BusinessHours];

  if (!hours) return false; // Closed if no hours for current day

  // Parse hours format like "9:00-18:00" or "09:00 - 18:00"
  const timeMatch = hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!timeMatch) return true; // Assume open if format is unrecognized

  const [, openHour, openMin, closeHour, closeMin] = timeMatch.map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export const businesses: Business[] = [];

export function getBusinessesByCategory(
  category: CategoryId,
  subcategory: string | null,
  allBusinesses: Business[],
): Business[] {
  return allBusinesses
    .filter((b) => b.status !== 'hidden' && b.status !== 'suspended')
    .filter((b) => b.category === category)
    .filter((b) => !subcategory || b.subcategory === subcategory)
    .sort((a, b) => b.bid - a.bid);
}

export function getMinBidForPosition(
  ranked: Business[],
  position: number,
): number {
  if (position <= 1) {
    return ranked.length > 0 ? ranked[0].bid + MIN_INCREMENT : MIN_BID;
  }
  if (position - 1 < ranked.length) {
    return ranked[position - 1].bid + MIN_INCREMENT;
  }
  return MIN_BID;
}

export function formatARS(amount: number): string {
  return '$' + amount.toLocaleString('es-AR') + ' ARS';
}
