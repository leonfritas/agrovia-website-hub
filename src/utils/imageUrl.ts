/**
 * Utilitário para construir URLs de imagens da API externa
 * Funciona tanto em desenvolvimento (localhost) quanto em produção (Vercel)
 */

// Detectar automaticamente a URL da API
const getApiBaseUrl = () => {
  let baseUrl = '';
  
  // Se definido no .env.local, usar esse valor
  if (process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL;
    // Garantir que seja HTTP em desenvolvimento
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
      baseUrl = baseUrl.replace('https://', 'http://');
    }
  } else {
    // Detectar automaticamente se estamos em desenvolvimento
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      if (currentPort === '3000' || currentPort === '3001' || currentPort === '3002') {
        baseUrl = 'http://localhost:4000';
      } else {
        baseUrl = 'http://localhost:4000';
      }
    } else {
      baseUrl = 'http://localhost:4000';
    }
  }
  
  // Remover /api do final se estiver presente para evitar duplicação
  return baseUrl.replace(/\/api$/, '');
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Constrói URL de imagem da API externa
 * @param imagePath - Caminho da imagem vindo do banco de dados
 * @returns URL completa da imagem ou fallback
 */
export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    return '/images/icon.png'; // Fallback padrão
  }

  // Remove barra inicial se existir para evitar //
  const cleanPath = imagePath.startsWith('/') 
    ? imagePath.substring(1) 
    : imagePath;

  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Constrói URL de imagem com fallback customizado
 * @param imagePath - Caminho da imagem vindo do banco de dados
 * @param fallback - Imagem de fallback customizada
 * @returns URL completa da imagem ou fallback customizado
 */
export function getImageUrlWithFallback(imagePath?: string, fallback: string = '/images/icon.png'): string {
  if (!imagePath) {
    return fallback;
  }

  const cleanPath = imagePath.startsWith('/') 
    ? imagePath.substring(1) 
    : imagePath;

  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Verifica se uma URL é válida para Next.js Image
 * @param url - URL para verificar
 * @returns true se válida, false caso contrário
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Constrói URL de imagem com validação e fallback
 * @param imagePath - Caminho da imagem vindo do banco de dados
 * @param fallback - Imagem de fallback
 * @returns URL válida ou fallback
 */
export function getValidImageUrl(imagePath?: string, fallback: string = '/images/icon.png'): string {
  if (!imagePath) {
    return fallback;
  }

  const imageUrl = getImageUrl(imagePath);
  
  // Se a URL não for válida, retorna fallback
  if (!isValidImageUrl(imageUrl)) {
    console.warn(`URL de imagem inválida: ${imageUrl}, usando fallback: ${fallback}`);
    return fallback;
  }

  return imageUrl;
}
