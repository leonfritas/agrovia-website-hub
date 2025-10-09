"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Post não encontrado');
        }

        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar post');
        console.error('Erro ao buscar post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B5B33]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Post não encontrado'}
          </h1>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#7B5B33] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para página inicial
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header fixo com botão voltar */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#7B5B33] hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Conteúdo do post */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Badge da categoria */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm font-medium text-white mb-6">
          {post.nomeCategoria}
        </span>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {post.nomePost}
        </h1>

        {/* Metadados */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b">
          <span>Por {post.nomeUsuario}</span>
          <span>•</span>
          <time>{formatDate(post.dataPost)}</time>
        </div>

        {/* Descrição */}
        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          {post.descricao}
        </p>

        {/* Imagem de destaque */}
        {post.imagemDestaque && (
          <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden">
            <Image
              src={`${API_BASE_URL.replace('/api', '')}${post.imagemDestaque}`}
              alt={post.nomePost}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Conteúdo principal */}
        {post.conteudo && (
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.conteudo }}
            />
          </div>
        )}

        {/* Imagem do conteúdo */}
        {post.imagemConteudo && (
          <div className="relative w-full aspect-video my-8 rounded-2xl overflow-hidden">
            <Image
              src={`${API_BASE_URL.replace('/api', '')}${post.imagemConteudo}`}
              alt={`Imagem do conteúdo: ${post.nomePost}`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Link externo */}
        {post.linkExterno && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Link relacionado:</p>
            <a 
              href={post.linkExterno}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7B5B33] hover:underline font-medium"
            >
              {post.linkExterno}
            </a>
          </div>
        )}

        {/* Botão voltar (rodapé) */}
        <div className="mt-12 pt-8 border-t">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#7B5B33] hover:underline font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para página inicial
          </Link>
        </div>
      </article>
    </main>
  );
}
