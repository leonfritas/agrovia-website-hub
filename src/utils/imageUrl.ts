/**
 * Utilitário para construir URLs de imagens da API externa
 * Funciona tanto em desenvolvimento (localhost) quanto em produção (Vercel)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://93c44447ef94.ngrok-free.app/api';

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

  // Remove /api da URL base para construir URL da imagem
  const baseUrl = API_BASE_URL.replace('/api', '');
  
  return `${baseUrl}/${cleanPath}`;
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

  const baseUrl = API_BASE_URL.replace('/api', '');
  
  return `${baseUrl}/${cleanPath}`;
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
