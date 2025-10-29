/**
 * Utilitário para corrigir URLs de vídeos e imagens
 * Converte caminhos relativos do painel admin para URLs absolutas da API
 */

// Detectar automaticamente a porta da API baseada no ambiente
const getApiBaseUrl = () => {
  // Se definido no .env.local, usar esse valor
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Garantir que seja HTTP em desenvolvimento
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url.replace('https://', 'http://');
    }
    return url;
  }
  
  // Detectar automaticamente se estamos em desenvolvimento
  if (typeof window !== 'undefined') {
    // No cliente, tentar detectar a porta baseada na URL atual
    const currentPort = window.location.port;
    if (currentPort === '3000' || currentPort === '3001' || currentPort === '3002') {
      // Se o website está na porta 3000/3001/3002, a API provavelmente está na 4000
      return 'http://localhost:4000';
    }
  }
  
  // Fallback padrão - usar porta 4000 onde a API está rodando
  return 'http://localhost:4000';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Corrige a URL de um vídeo para ser acessível pelo website
 * @param urlArquivo - URL do arquivo de vídeo
 * @returns URL corrigida ou string vazia se não houver arquivo
 */
export function getVideoUrl(urlArquivo?: string | null): string {
  if (!urlArquivo) return '';
  
  // Se já é uma URL completa (http/https), usar como está
  if (urlArquivo.startsWith('http')) {
    return urlArquivo;
  }
  
  // Se é um caminho relativo do painel admin, converter para URL da API
  if (urlArquivo.startsWith('./public/') || urlArquivo.startsWith('/public/')) {
    return `${API_BASE_URL}${urlArquivo.replace('./', '/')}`;
  }
  
  // Se é um caminho de upload da API, adicionar base URL
  if (urlArquivo.startsWith('/upload-')) {
    return `${API_BASE_URL}${urlArquivo}`;
  }
  
  // Se já começa com /, adicionar base URL
  if (urlArquivo.startsWith('/')) {
    return `${API_BASE_URL}${urlArquivo}`;
  }
  
  // Caso contrário, adicionar / e base URL
  return `${API_BASE_URL}/${urlArquivo}`;
}

/**
 * Corrige a URL de uma imagem/capa para ser acessível pelo website
 * @param urlCapa - URL da imagem de capa
 * @returns URL corrigida ou string vazia se não houver imagem
 */
export function getImageUrl(urlCapa?: string | null): string {
  if (!urlCapa) return '';
  
  // Se já é uma URL completa (http/https), usar como está
  if (urlCapa.startsWith('http')) {
    return urlCapa;
  }
  
  // Se é um caminho relativo do painel admin, converter para URL da API
  if (urlCapa.startsWith('./public/') || urlCapa.startsWith('/public/')) {
    return `${API_BASE_URL}${urlCapa.replace('./', '/')}`;
  }
  
  // Se é um caminho de upload da API, adicionar base URL
  if (urlCapa.startsWith('/upload-')) {
    return `${API_BASE_URL}${urlCapa}`;
  }
  
  // Se já começa com /, adicionar base URL
  if (urlCapa.startsWith('/')) {
    return `${API_BASE_URL}${urlCapa}`;
  }
  
  // Caso contrário, adicionar / e base URL
  return `${API_BASE_URL}/${urlCapa}`;
}

/**
 * Determina se o vídeo é externo (YouTube, Vimeo, etc.)
 * @param urlExterno - URL externa do vídeo
 * @returns true se for vídeo externo
 */
export function isExternalVideo(urlExterno?: string | null): boolean {
  return !!(urlExterno && urlExterno.trim());
}

/**
 * Obtém a URL final do vídeo (externa ou arquivo)
 * @param video - Objeto do vídeo com urlArquivo e urlExterno
 * @returns URL final do vídeo
 */
export function getFinalVideoUrl(video: {
  urlArquivo?: string | null;
  urlExterno?: string | null;
}): string {
  // Priorizar vídeo externo se existir
  if (isExternalVideo(video.urlExterno)) {
    return video.urlExterno!;
  }
  
  // Usar arquivo local se existir
  if (video.urlArquivo) {
    return getVideoUrl(video.urlArquivo);
  }
  
  return '';
}

/**
 * Valida se uma URL de vídeo é válida
 * @param url - URL para validar
 * @returns true se a URL for válida
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  // URLs externas válidas
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return true;
  }
  
  // URLs de arquivo válidas
  if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || url.includes('.webm')) {
    return true;
  }
  
  return false;
}

/**
 * Obtém o tipo de vídeo baseado na URL
 * @param url - URL do vídeo
 * @returns 'external' | 'local' | 'unknown'
 */
export function getVideoType(url: string): 'external' | 'local' | 'unknown' {
  if (!url) return 'unknown';
  
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return 'external';
  }
  
  if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || url.includes('.webm')) {
    return 'local';
  }
  
  return 'unknown';
}
