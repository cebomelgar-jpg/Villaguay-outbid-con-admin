import { type CategoryId } from '@/lib/mockData';

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_IMAGE_DIMENSION = 600;

const categoryColors: Record<CategoryId, string> = {
  gastronomia: '#FF6B6B',
  indumentaria: '#4ECDC4',
  estetica: '#A855F7',
  automotor: '#F59E0B',
  construccion: '#EF4444',
  salud: '#10B981',
  oficios: '#6366F1',
  profesionales: '#8B5CF6',
  alojamiento: '#F97316',
  mascotas: '#EC4899',
};

const categoryIcons: Record<CategoryId, string> = {
  gastronomia: '🍕',
  indumentaria: '👕',
  estetica: '✂️',
  automotor: '🔧',
  construccion: '🏗️',
  salud: '💪',
  oficios: '🛠️',
  profesionales: '💼',
  alojamiento: '🏨',
  mascotas: '🐾',
};

export const getCategoryPlaceholder = (category: CategoryId, name: string): string => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const color = categoryColors[category] || '#8B5CF6';

  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color}" fill-opacity="0.15"/>
      <rect width="400" height="400" fill="${color}" fill-opacity="0.05"/>
      <text x="200" y="200" font-size="72" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${color}">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('La imagen excede el tamaño máximo de 2MB'));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize if needed
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Error al procesar la imagen'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with quality
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
};

export const getStorePlaceholder = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMxYTI5MzciIGZpbGwtb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiM4YjVmYTYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CiAgPHJlY3QgeD0iMzUiIHk9IjYwIiB3aWR0aD0iMzAiIGhlaWdodD0iMjUiIHJ4PSIzIiBmaWxsPSIjOGI1ZjY2IiBmaWxsLW9wYWNpdHk9IjAuMyIvPgogIDxwYXRoIGQ9Ik01MCAzNSBWNjBNNjAgNjBWNzUiIHN0cm9rZT0iIzhiNWY2NiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
};
