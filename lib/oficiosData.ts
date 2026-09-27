export type Medal = 'oro' | 'plata' | 'bronce' | 'recomendado' | 'nuevo';

export interface Oficio {
  id: string;
  name: string;
  nickname?: string;
  trade: string;
  zone: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  medal: Medal;
  bio: string;
  available: boolean;
}

const MEDAL_LABELS: Record<Medal, string> = {
  oro: 'Medalla de Oro',
  plata: 'Medalla de Plata',
  bronce: 'Medalla de Bronce',
  recomendado: 'Recomendado',
  nuevo: 'Nuevo',
};

export function medalLabel(m: Medal): string {
  return MEDAL_LABELS[m];
}

export const OFICIO_TRADES: string[] = [
  'Electricista',
  'Plomero',
  'Pintor',
  'Cortador de pasto',
  'Cuidador',
  'Albañil',
  'Carpintero',
  'Herrero',
  'Refrigeración',
  'Cerrajero',
  'Jardinero',
  'Limpieza',
  'Flete',
  'Mecánico',
  'Gomero',
  'Técnico en celulares',
  'Técnico en PC',
  'Peluquero a domicilio',
  'Domiciliario',
  'Changarín',
];

export const VILLAGUAY_ZONES: string[] = [
  'Centro',
  'Barrio San Martín',
  'Barrio Belgrano',
  'Barrio Sargento Cabral',
  'Barrio 2 de Abril',
  'Barrio Fonavi',
  'Barrio Calesita',
  'Barrio La Cumbre',
  'Barrio Quintana',
  'Barrio Independencia',
  'Zona Rural',
  'Todo Villaguay',
];

export const oficiosSeed: Oficio[] = [
  {
    id: 'of-1',
    name: 'Carlos "Carlitos" Giménez',
    nickname: 'Carlitos',
    trade: 'Electricista',
    zone: 'Todo Villaguay',
    whatsapp: 'https://wa.me/549345551234',
    rating: 4.9,
    reviews: 37,
    medal: 'oro',
    bio: '20 años de experiencia. Instalaciones eléctricas domiciliarias y comerciales, tableros, urgencias.',
    available: true,
  },
  {
    id: 'of-2',
    name: 'Miguel Ángel Sosa',
    nickname: 'Miguel',
    trade: 'Plomero',
    zone: 'Centro y Barrio Fonavi',
    whatsapp: 'https://wa.me/549345552345',
    rating: 4.8,
    reviews: 29,
    medal: 'plata',
    bio: 'Plomería integral, pérdidas, destapes, instalación de cisternas y bombas de agua.',
    available: true,
  },
  {
    id: 'of-3',
    name: 'Lucía Fernández',
    trade: 'Pintora',
    zone: 'Barrio San Martín',
    whatsapp: 'https://wa.me/549345553456',
    rating: 4.7,
    reviews: 21,
    medal: 'bronce',
    bio: 'Pintura de interiors y exteriores. Trabajo prolijo, materiales incluidos opcional.',
    available: true,
  },
  {
    id: 'of-4',
    name: 'Don Roberto "Tito" Álvarez',
    nickname: 'Tito',
    trade: 'Cortador de pasto',
    zone: 'Todo Villaguay',
    whatsapp: 'https://wa.me/549345554567',
    rating: 4.6,
    reviews: 15,
    medal: 'recomendado',
    bio: 'Parquización y mantenimiento de jardines. Servicio periódico o por única vez.',
    available: true,
  },
  {
    id: 'of-5',
    name: 'Cristian Maidana',
    trade: 'Cuidador',
    zone: 'Barrio Belgrano',
    whatsapp: 'https://wa.me/549345555678',
    rating: 4.9,
    reviews: 12,
    medal: 'recomendado',
    bio: 'Cuidado de adultos mayores y acompañamiento. Paciencia y responsabilidad.',
    available: false,
  },
  {
    id: 'of-6',
    name: 'Walter "Pipi" Domínguez',
    nickname: 'Pipi',
    trade: 'Albañil',
    zone: 'Centro y Barrio Calesita',
    whatsapp: 'https://wa.me/549345556789',
    rating: 4.5,
    reviews: 18,
    medal: 'recomendado',
    bio: 'Construcción, refacciones, revoques, contrapisos. Trabajo a jornal o por presupuesto.',
    available: true,
  },
  {
    id: 'of-7',
    name: 'Natalí Ríos',
    trade: 'Técnica en celulares',
    zone: 'Barrio 2 de Abril',
    whatsapp: 'https://wa.me/549345557890',
    rating: 5.0,
    reviews: 8,
    medal: 'nuevo',
    bio: 'Reparación de celulares, cambio de módulos, baterías, desbloqueos. Atención a domicilio.',
    available: true,
  },
  {
    id: 'of-8',
    name: 'Sebastián "Seba" Luna',
    nickname: 'Seba',
    trade: 'Flete',
    zone: 'Todo Villaguay',
    whatsapp: 'https://wa.me/549345558901',
    rating: 4.4,
    reviews: 24,
    medal: 'bronce',
    bio: 'Fletes y mudanzas dentro y alrededor de Villaguay. Camioneta con toldo.',
    available: true,
  },
];

export const SUPPORT_WHATSAPP_OFICIOS = 'https://wa.me/5493450000000?text=' + encodeURIComponent('Hola! Quiero publicar mi oficio en Villaguay Outbid.');
