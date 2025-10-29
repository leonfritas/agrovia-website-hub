// Store simples para gerenciar posts e evitar requisições duplicadas

interface Post {
  idPost: number;
  nomePost: string;
  descricao: string;
  conteudo?: string;
  dataPost: string;
  imagemPost?: string;
  imagemDestaque?: string;
  imagemConteudo?: string;
  linkExterno?: string;
  idCategoria: number;
  nomeCategoria: string;
  idUsuario: number;
  nomeUsuario: string;
}

interface CacheEntry {
  data: Post[];
  timestamp: number;
}

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
      // No cliente, tentar detectar a porta baseada na URL atual
      const currentPort = window.location.port;
      if (currentPort === '3000' || currentPort === '3001' || currentPort === '3002') {
        // Se o website está na porta 3000/3001/3002, a API provavelmente está na 4000
        baseUrl = 'http://localhost:4000';
      } else {
        baseUrl = 'http://localhost:4000';
      }
    } else {
      // Fallback padrão - usar porta 4000 onde a API está rodando
      baseUrl = 'http://localhost:4000';
    }
  }
  
  // Remover /api do final se estiver presente para evitar duplicação
  return baseUrl.replace(/\/api$/, '');
};

const API_BASE_URL = getApiBaseUrl();
const CACHE_DURATION = 60000; // 60 segundos

class PostsStore {
  private cache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, Promise<Post[]>> = new Map();
  private listeners: Map<string, Set<(posts: Post[]) => void>> = new Map();

  private notifyListeners(key: string, posts: Post[]) {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(listener => listener(posts));
    }
  }

  subscribe(key: string, callback: (posts: Post[]) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Retornar função de unsubscribe
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  async getPosts(categoriaNome?: string): Promise<Post[]> {
    const cacheKey = categoriaNome || 'all';
    const now = Date.now();

    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`📦 Cache hit para: ${cacheKey}`);
      return cached.data;
    }

    // Se já existe uma requisição em andamento, aguardar
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      console.log(`⏳ Requisição já em andamento para: ${cacheKey}`);
      return pending;
    }

    // Fazer nova requisição
    console.log(`🔄 Buscando posts para: ${cacheKey}`);
    
    let url = `${API_BASE_URL}/api/posts`;
    if (categoriaNome) {
      url = `${API_BASE_URL}/api/posts/secao/${encodeURIComponent(categoriaNome)}`;
    }

    const requestPromise = fetch(url, {
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.posts || [];
      })
      .then((posts) => {
        // Salvar no cache
        this.cache.set(cacheKey, {
          data: posts,
          timestamp: now
        });

        // Remover de requisições pendentes
        this.pendingRequests.delete(cacheKey);

        // Notificar listeners
        this.notifyListeners(cacheKey, posts);

        console.log(`✅ Posts carregados para ${cacheKey}:`, posts.length);
        return posts;
      })
      .catch((err) => {
        // Remover de requisições pendentes em caso de erro
        this.pendingRequests.delete(cacheKey);
        console.error(`❌ Erro ao buscar posts para ${cacheKey}:`, err);
        throw err;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  clearCache(categoriaNome?: string) {
    if (categoriaNome) {
      this.cache.delete(categoriaNome);
    } else {
      this.cache.clear();
    }
  }
}

export const postsStore = new PostsStore();
