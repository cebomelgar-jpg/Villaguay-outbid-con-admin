const fs = require('fs');
const path = require('path');

// Category mapping - more comprehensive
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
  'Comida': 'gastronomia',
  'Sandwich': 'gastronomia',
  'Hamburguesa': 'gastronomia',
  'Asador': 'gastronomia',
  'Parrilla': 'gastronomia',
  'Pastelería': 'gastronomia',
  
  // Indumentaria
  'Tienda de ropa': 'indumentaria',
  'Tienda de calzado': 'indumentaria',
  'Tienda deportiva': 'indumentaria',
  'Moda': 'indumentaria',
  'Indumentaria': 'indumentaria',
  'Calzado': 'indumentaria',
  'Zapatillas': 'indumentaria',
  'Ropa': 'indumentaria',
  'Textil': 'indumentaria',
  'Camisetas': 'indumentaria',
  
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
  
  // Salud
  'Farmacia': 'salud',
  'Gimnasio': 'salud',
  'Centro de entrenamiento': 'salud',
  'Kinesiología': 'salud',
  'Nutrición': 'salud',
  'Dietética': 'salud',
  'Médico': 'salud',
  'Odontología': 'salud',
  'Laboratorio': 'salud',
  
  // Construcción
  'Ferretería': 'construccion',
  'Corralón': 'construccion',
  'Materiales': 'construccion',
  'Construcción': 'construccion',
  'Pintura': 'construccion',
  
  // Automotor
  'Taller mecánico': 'automotor',
  'Mecánica': 'automotor',
  'Electricidad del automóvil': 'automotor',
  'Gomería': 'automotor',
  'Repuestos': 'automotor',
  'Neumáticos': 'automotor',
  
  // Oficios
  'Electricidad': 'oficios',
  'Electrodomésticos': 'oficios',
  'Servicio técnico': 'oficios',
  'Refrigeración': 'oficios',
  'Aire acondicionado': 'oficios',
  'Jardinería': 'oficios',
  'Limpieza': 'oficios',
  'Plomería': 'oficios',
  'Cerrajería': 'oficios',
  
  // Profesionales
  'Oficina': 'profesionales',
  'Abogado': 'profesionales',
  'Contador': 'profesionales',
  'Imprenta': 'profesionales',
  'Diseño': 'profesionales',
  'Fotografía': 'profesionales',
  'Celulares': 'profesionales',
  'Tecnología': 'profesionales',
  
  // Alojamiento
  'Hotel': 'alojamiento',
  'Hostel': 'alojamiento',
  'Cabaña': 'alojamiento',
  
  // Mascotas
  'Veterinaria': 'mascotas',
  'Pet shop': 'mascotas',
  'Veterinario': 'mascotas',
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
    'Comida': 'rotiserias',
    'Sandwich': 'rotiserias',
    'Hamburguesa': 'rotiserias',
    'Asador': 'restaurantes',
    'Parrilla': 'restaurantes',
    'Pastelería': 'cafeterias',
  },
  'indumentaria': {
    'Tienda de ropa': 'ropa_fm',
    'Tienda de calzado': 'calzado',
    'Tienda deportiva': 'ropa_fm',
    'Moda': 'ropa_fm',
    'Indumentaria': 'ropa_fm',
    'Calzado': 'calzado',
    'Zapatillas': 'calzado',
    'Ropa': 'ropa_fm',
    'Textil': 'ropa_fm',
    'Camisetas': 'ropa_fm',
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
  },
  'construccion': {
    'Ferretería': 'ferreterias',
    'Corralón': 'corralones',
    'Materiales': 'ferreterias',
    'Construcción': 'corralones',
    'Pintura': 'pintura',
  },
  'automotor': {
    'Taller mecánico': 'talleres',
    'Mecánica': 'talleres',
    'Electricidad del automóvil': 'talleres',
    'Gomería': 'talleres',
    'Repuestos': 'refrigeracion',
    'Neumáticos': 'talleres',
  },
  'oficios': {
    'Electricidad': 'electricidad',
    'Electrodomésticos': 'refrigeracion',
    'Servicio técnico': 'refrigeracion',
    'Refrigeración': 'refrigeracion',
    'Aire acondicionado': 'refrigeracion',
    'Jardinería': 'jardines',
    'Limpieza': 'pintura',
    'Plomería': 'plomeria',
    'Cerrajería': 'cerrajeria',
    'Gas': 'electricidad',
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
  },
  'alojamiento': {
    'Hotel': 'hoteles',
    'Hostel': 'hoteles',
    'Cabaña': 'hoteles',
  },
  'mascotas': {
    'Veterinaria': 'veterinaria',
    'Pet shop': 'veterinaria',
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
  // Scale bids from 500 to 3000 based on rank
  const baseBid = 500;
  const increment = 2500 / 30; // 30 businesses
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

// Filter out businesses that don't match our main categories
const validCategories = ['gastronomia', 'indumentaria', 'estetica', 'salud', 'construccion', 'automotor', 'oficios', 'profesionales'];
const selectedBusinesses = [];
const categoryCounts = { gastronomia: 0, indumentaria: 0, estetica: 0, salud: 0, construccion: 0, automotor: 0, oficios: 0, profesionales: 0 };
const maxPerCategory = 5; // Max 5 businesses per category

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
  'obispado', 'catedral', 'parroquia', 'capilla', 'monumento'
];

for (const biz of allVillaguayBusinesses) {
  if (selectedBusinesses.length >= 30) break;
  
  const category = mapCategory(biz.categoryName, biz.title);
  const titleLower = biz.title.toLowerCase();
  const categoryLower = (biz.categoryName || '').toLowerCase();
  
  // Skip if it contains exclude keywords
  const shouldExclude = excludeKeywords.some(keyword => 
    titleLower.includes(keyword) || categoryLower.includes(keyword)
  );
  
  if (shouldExclude) continue;
  
  // Only include if it's one of our main categories
  if (validCategories.includes(category) && categoryCounts[category] < maxPerCategory) {
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
