"use client";

import { useState, useEffect } from 'react';
import { postsStore } from '@/lib/postsStore';

export interface Post {
  idPost: number;
  nomePost: string;
  descricao: string;
  conteudo?: string;
  dataPost: string;
  imagemPost?: string;
  imagemDestaque?: string;
  imagemConteudo?: string;
  imagemFooter?: string;
  linkExterno?: string;
  conteudoFooter?: string;
  idCategoria: number;
  nomeCategoria: string;
  idUsuario: number;
  nomeUsuario: string;
}

export interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
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

export const usePosts = (categoriaNome?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await postsStore.getPosts(categoriaNome);
        
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        if (isMounted) {
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [categoriaNome]);

  return { posts, loading, error };
};

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/categorias/site`, {
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Erro ao carregar categorias');
        }

        const data = await response.json();
        setCategorias(data.categorias || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar categorias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};
