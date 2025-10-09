"use client";

import { useState, useEffect } from 'react';

export interface Post {
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

export interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const usePosts = (categoriaNome?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        console.log(`🔄 Buscando posts para categoria: ${categoriaNome || 'todas'}`);
        setLoading(true);
        setError(null);

        let url = `${API_BASE_URL}/posts`;
        if (categoriaNome) {
          url = `${API_BASE_URL}/posts/secao/${encodeURIComponent(categoriaNome)}`;
        }

        console.log(`📡 URL da requisição: ${url}`);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Posts recebidos:`, data.posts?.length || 0);

        if (isMounted) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('⚠️ Requisição cancelada');
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('❌ Erro ao buscar posts:', errorMessage);
        if (isMounted) {
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
      controller.abort();
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

        const response = await fetch(`${API_BASE_URL}/categorias/site`);
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
