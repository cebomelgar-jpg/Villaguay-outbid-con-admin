const fs = require('fs');
const path = require('path');

// Category mapping - comprehensive and accurate categorization
const categoryMapping = {
  // Gastronomía
  'Restaurante': 'gastronomia',
  'Restaurante de comida para llevar': 'gastronomia',
  'Restaurante especializado en barbacoa': 'gastronomia',
  'Cafetería': 'gastronomia',
  'Heladería': 'gastronomia',
  'Panadería': 'gastronomia',
  'Confitería': 'gastronomia',
  'Pizzería': 'gastronomia',
  'Bar': 'gastronomia',
  'Bares': 'gastronomia',
  'Pub': 'gastronomia',
  'Cervecería': 'gastronomia',
  'Rotisería': 'gastronomia',
  'Rotiserias': 'gastronomia',
  'Comida': 'gastronomia',
  'Sandwich': 'gastronomia',
  'Hamburguesa': 'gastronomia',
  'Asador': 'gastronomia',
  'Parrilla': 'gastronomia',
  'Pastelería': 'gastronomia',
  'Café': 'gastronomia',
  'Cafe': 'gastronomia',
  'Comida rápida': 'gastronomia',
  'Delivery': 'gastronomia',
  'Empanadas': 'gastronomia',
  'Minutas': 'gastronomia',
  'Pastas': 'gastronomia',
  'Lunch': 'gastronomia',
  'Desayuno': 'gastronomia',
  'Brunch': 'gastronomia',
  'Comidas rápidas': 'gastronomia',
  
  // Indumentaria y Calzado (incluye deportes)
  'Tienda de ropa': 'indumentaria',
  'Tienda de calzado': 'indumentaria',
  'Tienda deportiva': 'indumentaria',
  'Deportes': 'indumentaria',
  'Maratón': 'indumentaria',
  'Sport': 'indumentaria',
  'Zapatillas': 'indumentaria',
  'Moda': 'indumentaria',
  'Indumentaria': 'indumentaria',
  'Calzado': 'indumentaria',
  'Ropa': 'indumentaria',
  'Textil': 'indumentaria',
  'Camisetas': 'indumentaria',
  'Ropa deportiva': 'indumentaria',
  'Artículos deportivos': 'indumentaria',
  'Equipamiento deportivo': 'indumentaria',
  'Zapatos': 'indumentaria',
  'Botas': 'indumentaria',
  'Lencería': 'indumentaria',
  'Accesorios de moda': 'indumentaria',
  'Boutique': 'indumentaria',
  'Outlet': 'indumentaria',
  
  // Estética
  'Barbería': 'estetica',
  'Peluquería': 'estetica',
  'Salón de belleza': 'estetica',
  'Centro de estética': 'estetica',
  'Manicura': 'estetica',
  'Tatuajes': 'estetica',
  'Tatuaje': 'estetica',
  'Peluquerero': 'estetica',
  'Masajes': 'estetica',
  'Spa': 'estetica',
  'Uñas': 'estetica',
  'Pestañas': 'estetica',
  'Cejas': 'estetica',
  'Cabello': 'estetica',
  'Belleza': 'estetica',
  'Cosmética': 'estetica',
  'Peluquerías': 'estetica',
  'Centros de estética': 'estetica',
  
  // Salud
  'Farmacia': 'salud',
  'Gimnasio': 'salud',
  'Centro de entrenamiento': 'salud',
  'Kinesiología': 'estetica',
  'Nutrición': 'salud',
  'Dietética': 'salud',
  'Médico': 'salud',
  'Odontología': 'salud',
  'Laboratorio': 'salud',
  'Clínica': 'salud',
  'Hospital': 'salud',
  'Centro de salud': 'salud',
  'Fitness': 'salud',
  'CrossFit': 'salud',
  'Yoga': 'salud',
  'Pilates': 'salud',
  'Fisioterapia': 'salud',
  'Veterinaria': 'mascotas',
  'Pet shop': 'mascotas',
  'Veterinario': 'mascotas',
  
  // Construcción (ferreterías y materiales)
  'Ferretería': 'construccion',
  'Corralón': 'construccion',
  'Materiales': 'construccion',
  'Construcción': 'construccion',
  'Pintura': 'construccion',
  'Pinturería': 'construccion',
  'Carpintería': 'construccion',
  'Herrería': 'construccion',
  'Maderas': 'construccion',
  'Hormigón': 'construccion',
  'Ladrillos': 'construccion',
  'Sanitarios': 'construccion',
  'Iluminación': 'oficios',
  'Plomería': 'oficios',
  'Baños': 'construccion',
  'Cerámicos': 'construccion',
  'Pisos': 'construccion',
  
  // Automotor (talleres y repuestos)
  'Taller mecánico': 'automotor',
  'Mecánica': 'automotor',
  'Electricidad del automóvil': 'automotor',
  'Gomería': 'automotor',
  'Repuestos': 'automotor',
  'Neumáticos': 'automotor',
  'Autopartes': 'automotor',
  'Servicio técnico automotriz': 'automotor',
  'Lavadero': 'automotor',
  'Detailing': 'automotor',
  'Motos': 'automotor',
  'Bicicletas': 'automotor',
  'Fletes': 'automotor',
  'Transporte': 'automotor',
  'Concesionaria': 'automotor',
  'Automóvil': 'automotor',
  'Auto': 'automotor',
  'Carro': 'automotor',
  'Vehículo': 'automotor',
  'Chapa': 'automotor',
  'Parabrisas': 'automotor',
  'Lubricentro': 'automotor',
  'Baterías': 'automotor',
  'Escape': 'automotor',
  'Frenos': 'automotor',
  'Suspensión': 'automotor',
  'Motor': 'automotor',
  'Tapicería': 'automotor',
  'Vidrio automotriz': 'automotor',
  'Carrocería': 'automotor',
  'GNC': 'automotor',
  'Estación de servicio': 'oficios', // Keep gas stations in oficios, not automotor
  'Ypf': 'oficios',
  'Shell': 'oficios',
  'Axion': 'oficios',
  'Combustibles': 'oficios',
  
  // Oficios (servicios técnicos del hogar)
  'Electricidad': 'oficios',
  'Electrodomésticos': 'oficios',
  'Servicio técnico': 'oficios',
  'Refrigeración': 'oficios',
  'Aire acondicionado': 'oficios',
  'Jardinería': 'oficios',
  'Limpieza': 'oficios',
  'Plomería': 'oficios',
  'Cerrajería': 'oficios',
  'Gas': 'oficios',
  'Carpintería': 'construccion',
  'Albañilería': 'construccion',
  'Techos': 'construccion',
  'Instalaciones': 'oficios',
  'Mantenimiento': 'oficios',
  'Reparaciones': 'oficios',
  'Gasolinera': 'oficios',
  'Combustible': 'oficios',
  
  // Profesionales
  'Oficina': 'profesionales',
  'Abogado': 'profesionales',
  'Contador': 'profesionales',
  'Imprenta': 'profesionales',
  'Diseño': 'profesionales',
  'Fotografía': 'profesionales',
  'Celulares': 'profesionales',
  'Tecnología': 'profesionales',
  'Computación': 'profesionales',
  'Inmobiliaria': 'profesionales',
  'Seguros': 'profesionales',
  'Gestoría': 'profesionales',
  'Consultoría': 'profesionales',
  'Marketing': 'profesionales',
  'Publicidad': 'profesionales',
  
  // Alojamiento
  'Hotel': 'alojamiento',
  'Hostel': 'alojamiento',
  'Cabaña': 'alojamiento',
  'Motel': 'alojamiento',
  'Camping': 'alojamiento',
  'Posada': 'alojamiento',
  'Bed and breakfast': 'alojamiento',
};

const subcategoryMapping = {
  'gastronomia': {
    'Restaurante': 'restaurantes',
    'Restaurante de comida para llevar': 'rotiserias',
    'Restaurante especializado en barbacoa': 'restaurantes',
    'Cafetería': 'cafeterias',
    'Heladería': 'cafeterias',
    'Panadería': 'rotiserias',
    'Confitería': 'cafeterias',
    'Pizzería': 'rotiserias',
    'Bar': 'bares',
    'Bares': 'bares',
    'Pub': 'bares',
    'Cervecería': 'bares',
    'Rotisería': 'rotiserias',
    'Rotiserias': 'rotiserias',
    'Comida': 'rotiserias',
    'Sandwich': 'rotiserias',
    'Hamburguesa': 'rotiserias',
    'Asador': 'restaurantes',
    'Parrilla': 'restaurantes',
    'Pastelería': 'cafeterias',
    'Café': 'cafeterias',
    'Cafe': 'cafeterias',
    'Comida rápida': 'rotiserias',
    'Delivery': 'rotiserias',
    'Empanadas': 'rotiserias',
    'Minutas': 'rotiserias',
    'Pastas': 'rotiserias',
    'Lunch': 'restaurantes',
    'Desayuno': 'cafeterias',
    'Brunch': 'cafeterias',
    'Comidas rápidas': 'rotiserias',
  },
  'indumentaria': {
    'Tienda de ropa': 'ropa_fm',
    'Tienda de calzado': 'calzado',
    'Tienda deportiva': 'ropa_fm',
    'Deportes': 'ropa_fm',
    'Maratón': 'ropa_fm',
    'Sport': 'ropa_fm',
    'Zapatillas': 'calzado',
    'Moda': 'ropa_fm',
    'Indumentaria': 'ropa_fm',
    'Calzado': 'calzado',
    'Ropa': 'ropa_fm',
    'Textil': 'ropa_fm',
    'Camisetas': 'ropa_fm',
    'Ropa deportiva': 'ropa_fm',
    'Artículos deportivos': 'ropa_fm',
    'Equipamiento deportivo': 'ropa_fm',
    'Zapatos': 'calzado',
    'Botas': 'calzado',
    'Lencería': 'lenceria',
    'Accesorios de moda': 'joyeria',
    'Boutique': 'ropa_fm',
    'Outlet': 'ropa_fm',
  },
  'estetica': {
    'Barbería': 'peluquerias',
    'Peluquería': 'peluquerias',
    'Salón de belleza': 'centros_estetica',
    'Centro de estética': 'centros_estetica',
    'Manicura': 'unas',
    'Tatuajes': 'tatuajes',
    'Tatuaje': 'tatuajes',
    'Peluquerero': 'peluquerias',
    'Masajes': 'centros_estetica',
    'Spa': 'centros_estetica',
    'Uñas': 'unas',
    'Pestañas': 'pestanas',
    'Cejas': 'pestanas',
    'Cabello': 'peluquerias',
    'Belleza': 'centros_estetica',
    'Cosmética': 'centros_estetica',
    'Peluquerías': 'peluquerias',
    'Centros de estética': 'centros_estetica',
  },
  'salud': {
    'Farmacia': 'dieteticas',
    'Gimnasio': 'gimnasios',
    'Centro de entrenamiento': 'canchas',
    'Kinesiología': 'kinesiologia',
    'Nutrición': 'dieteticas',
    'Dietética': 'dieteticas',
    'Médico': 'clinicas',
    'Odontología': 'clinicas',
    'Laboratorio': 'clinicas',
    'Clínica': 'clinicas',
    'Hospital': 'clinicas',
    'Centro de salud': 'clinicas',
    'Fitness': 'gimnasios',
    'CrossFit': 'gimnasios',
    'Yoga': 'gimnasios',
    'Pilates': 'gimnasios',
    'Fisioterapia': 'kinesiologia',
  },
  'construccion': {
    'Ferretería': 'ferreterias',
    'Corralón': 'corralones',
    'Materiales': 'ferreterias',
    'Construcción': 'corralones',
    'Pintura': 'pintura',
    'Pinturería': 'pintura',
    'Carpintería': 'carpinteria',
    'Herrería': 'carpinteria',
    'Maderas': 'corralones',
    'Hormigón': 'corralones',
    'Ladrillos': 'ferreterias',
    'Sanitarios': 'ferreterias',
    'Iluminación': 'electricidad',
    'Plomería': 'plomeria',
    'Baños': 'ferreterias',
    'Cerámicos': 'ferreterias',
    'Pisos': 'ferreterias',
  },
  'automotor': {
    'Taller mecánico': 'talleres',
    'Mecánica': 'talleres',
    'Electricidad del automóvil': 'talleres',
    'Gomería': 'talleres',
    'Repuestos': 'refrigeracion',
    'Neumáticos': 'talleres',
    'Autopartes': 'refrigeracion',
    'Servicio técnico automotriz': 'talleres',
    'Lavadero': 'talleres',
    'Detailing': 'talleres',
    'Motos': 'motos',
    'Bicicletas': 'motos',
    'Fletes': 'fletes',
    'Transporte': 'fletes',
    'Concesionaria': 'refrigeracion',
    'Automóvil': 'talleres',
    'Auto': 'talleres',
    'Carro': 'talleres',
    'Vehículo': 'talleres',
    'Chapa': 'talleres',
    'Parabrisas': 'talleres',
    'Lubricentro': 'talleres',
    'Baterías': 'talleres',
    'Escape': 'talleres',
    'Frenos': 'talleres',
    'Suspensión': 'talleres',
    'Motor': 'talleres',
    'Tapicería': 'talleres',
    'Vidrio automotriz': 'talleres',
    'Carrocería': 'talleres',
    'GNC': 'talleres',
  },
  'oficios': {
    'Electricidad': 'electricidad',
    'Electrodomésticos': 'refrigeracion',
    'Servicio técnico': 'reparacion_cel',
    'Refrigeración': 'refrigeracion',
    'Aire acondicionado': 'refrigeracion',
    'Jardinería': 'jardines',
    'Limpieza': 'pintura',
    'Plomería': 'plomeria',
    'Cerrajería': 'cerrajeria',
    'Gas': 'electricidad',
    'Carpintería': 'carpinteria',
    'Albañilería': 'arquitectura',
    'Techos': 'arquitectura',
    'Instalaciones': 'electricidad',
    'Mantenimiento': 'electricidad',
    'Reparaciones': 'electricidad',
    'Estación de servicio': 'electricidad',
    'Ypf': 'electricidad',
    'Shell': 'electricidad',
    'Axion': 'electricidad',
    'Combustibles': 'electricidad',
    'Gasolinera': 'electricidad',
    'Combustible': 'electricidad',
  },
  'profesionales': {
    'Oficina': 'diseno',
    'Abogado': 'abogados',
    'Contador': 'abogados',
    'Imprenta': 'diseno',
    'Diseño': 'diseno',
    'Fotografía': 'diseno',
    'Celulares': 'reparacion_cel',
    'Tecnología': 'reparacion_cel',
    'Computación': 'reparacion_cel',
    'Inmobiliaria': 'inmobiliarias',
    'Seguros': 'gestoria',
    'Gestoría': 'gestoria',
    'Consultoría': 'abogados',
    'Marketing': 'diseno',
    'Publicidad': 'diseno',
  },
  'alojamiento': {
    'Hotel': 'hoteles',
    'Hostel': 'hoteles',
    'Cabaña': 'cabanas',
    'Motel': 'hoteles',
    'Camping': 'cabanas',
    'Posada': 'hoteles',
    'Bed and breakfast': 'hoteles',
  },
  'mascotas': {
    'Veterinaria': 'veterinaria',
    'Pet shop': 'pet_shop',
    'Veterinario': 'veterinaria',
  },
};

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function mapCategory(categoryName, title) {
  const text = (categoryName + ' ' + title).toLowerCase();
  
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (text.includes(key.toLowerCase())) {
      return value;
    }
  }
  return 'oficios'; // Default category
}

function mapSubcategory(category, categoryName, title) {
  const text = (categoryName + ' ' + title).toLowerCase();
  const mapping = subcategoryMapping[category] || {};
  
  for (const [key, value] of Object.entries(mapping)) {
    if (text.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Default subcategory based on category
  const defaults = {
    gastronomia: 'restaurantes',
    indumentaria: 'ropa_fm',
    estetica: 'peluquerias',
    salud: 'gimnasios',
    construccion: 'ferreterias',
    automotor: 'talleres',
    oficios: 'electricidad',
    profesionales: 'diseno',
    alojamiento: 'hoteles',
    mascotas: 'veterinaria',
  };
  return defaults[category] || 'restaurantes';
}

function formatPhone(phone) {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('54')) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/54${cleanPhone}`;
}

function generateBid(rank) {
  // Scale bids from 500 to 5000 based on rank (more range for 10 positions)
  const baseBid = 500;
  const increment = 4500 / 50; // 50 businesses max
  return Math.round(baseBid + (rank - 1) * increment);
}

// Read Apify JSON
const apifyData = JSON.parse(
  fs.readFileSync('C:\\Users\\Cebo PC\\Downloads\\dataset_crawler-google-places_2026-09-24_19-32-47-888.json', 'utf8')
);

// Process businesses - filter for Villaguay only and select diverse categories
const allVillaguayBusinesses = apifyData
  .filter(biz => !biz.permanentlyClosed && biz.city === 'Villaguay')
  .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)); // Sort by reviews (popularity)

// Keywords to exclude (non-business places)
const excludeKeywords = [
  'plaza', 'parque', 'polideportivo', 'centro de convenciones', 'papa francisco',
  'hospital', 'centro de salud', 'escuela', 'colegio', 'universidad',
  'municipalidad', 'comuna', 'gobierno', 'juzgado', 'comisaría',
  'banco', 'cajero', 'iglesia', 'catedral', 'capilla',
  'cementerio', 'estación de servicio', 'estacion de servicio', 'ypf', 'shell', 'axion',
  'aeropuerto', 'terminal', 'estación', 'terminal de ómnibus', 'gasolinera', 'gas',
  'club', 'asociación', 'asociacion', 'centenario', 'deportivo', 'sindicato',
  'biblioteca', 'museo', 'teatro', 'cultural', 'centro cultural',
  'estadio', 'kartódromo', 'kartodromo', 'termas', 'balneario', 'pileta',
  'obispado', 'catedral', 'parroquia', 'capilla', 'monumento',
  'taller de reparación de botas', // Exclude shoe repair (should be indumentaria, not automotor)
  'repuestos menfis', // Exclude auto parts that are actually hardware store
];

// Filter out businesses that don't match our main categories
const validCategories = ['gastronomia', 'indumentaria', 'estetica', 'salud', 'construccion', 'automotor', 'oficios', 'profesionales'];
const selectedBusinesses = [];
const categoryCounts = { gastronomia: 0, indumentaria: 0, estetica: 0, salud: 0, construccion: 0, automotor: 0, oficios: 0, profesionales: 0 };
const maxPerCategory = 10; // Max 10 businesses per category (up from 5)

// Adjust max for categories with fewer available businesses
const maxForCategory = { gastronomia: 10, indumentaria: 10, estetica: 10, salud: 10, construccion: 10, automotor: 10, oficios: 10, profesionales: 10 };

for (const biz of allVillaguayBusinesses) {
  if (selectedBusinesses.length >= 80) break; // Total limit based on category max
  
  const category = mapCategory(biz.categoryName, biz.title);
  const titleLower = biz.title.toLowerCase();
  const categoryLower = (biz.categoryName || '').toLowerCase();
  
  // Skip if it contains exclude keywords
  const shouldExclude = excludeKeywords.some(keyword => 
    titleLower.includes(keyword) || categoryLower.includes(keyword)
  );
  
  if (shouldExclude) continue;
  
  // Only include if it's one of our main categories
  const categoryMax = maxForCategory[category] || maxPerCategory;
  if (validCategories.includes(category) && categoryCounts[category] < categoryMax) {
    categoryCounts[category]++;
    selectedBusinesses.push(biz);
  }
}

const processedBusinesses = selectedBusinesses
  .map((biz, index) => {
    const category = mapCategory(biz.categoryName, biz.title);
    const subcategory = mapSubcategory(category, biz.categoryName, biz.title);
    const bid = generateBid(index + 1);
    
    return {
      id: `apify-${index + 1}`,
      name: biz.title,
      category: category,
      subcategory: subcategory,
      bid: bid,
      owner: 'Seed Data',
      address: biz.street || biz.address || 'Villaguay, Entre Ríos',
      image: '', // Use placeholders instead of external images
      whatsapp: formatPhone(biz.phoneUnformatted),
      instagram: biz.website || '',
      slogan: `Comercio en ${biz.categoryName || 'Villaguay'}`,
      daysAtTop: 0,
      clickCount: 0,
    };
  });

// Generate TypeScript file
const tsContent = `import { type Business, type CategoryId } from '@/lib/mockData';

export const villaguaySeedBusinesses: Business[] = [
${processedBusinesses.map(b => `  {
    id: '${b.id}',
    name: '${b.name.replace(/'/g, "\\'")}',
    category: '${b.category}' as CategoryId,
    subcategory: '${b.subcategory}',
    bid: ${b.bid},
    owner: '${b.owner}',
    address: '${b.address.replace(/'/g, "\\'")}',
    image: '${b.image}',
    whatsapp: '${b.whatsapp}',
    instagram: '${b.instagram}',
    slogan: '${b.slogan.replace(/'/g, "\\'")}',
    daysAtTop: ${b.daysAtTop},
    clickCount: ${b.clickCount},
  },`).join('\n')}
];

export const isSeedBusiness = (businessId: string): boolean => {
  return businessId.startsWith('apify-') || businessId.startsWith('seed-');
};
`;

// Write to file
const outputPath = path.join('C:\\Users\\Cebo PC\\Downloads\\Villaguayoutbid-main\\src\\data\\villaguaySeed.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`✅ Processed ${processedBusinesses.length} businesses from Apify data`);
console.log(`📝 Generated seed file at: ${outputPath}`);
console.log('\n📊 Business distribution:');
const categoryCount = {};
processedBusinesses.forEach(b => {
  categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
});
Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} businesses`);
});
