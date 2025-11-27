"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, ExternalLink, Sparkles } from "lucide-react";

interface Post {
  idPost: number;
  nomePost: string;
  descricao: string;
  conteudo?: string;
  dataPost: string;
  imagemPost?: string;
  imagemDestaque?: string;
  imagemConteudo?: string;
  imagemFooter?: string;
  conteudoFooter?: string;
  linkExterno?: string;
  idCategoria: number;
  nomeCategoria: string;
  idUsuario: number;
  nomeUsuario: string;
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

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousSection, setPreviousSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (post) {
      setIsVisible(true);
    }
  }, [post]);

  // Salvar posição de scroll ao carregar a página
  useEffect(() => {
    // Recuperar posição de scroll salva
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      console.log('Posição de scroll salva:', savedScrollPosition);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log(`Buscando post ID: ${params.id}`);
        const url = `${API_BASE_URL}/api/posts/${params.id}`;
        console.log(`URL: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        });
        console.log(`📊 Status: ${response.status}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Erro da API:', errorData);
          throw new Error(errorData.message || 'Post não encontrado');
        }

        const data = await response.json();
        console.log('Post carregado:', data.post);
        setPost(data.post);
        
        // Determinar a seção de origem baseada na categoria
        const sectionMap: Record<string, string> = {
          'Agrovia Ensina': '#agrovia-ensina',
          'Agrovia Legal': '#agrovia-legal',
          'Agrovia Inspira': '#agrovia-inspira',
          'Agrovia Atual': '#agrovia-atual',
          'Agrovia Conversa': '#agrovia-conversa',
          'Guia Agrovia': '#guia-agrovia'
        };
        
        const section = sectionMap[data.post.nomeCategoria] || '';
        setPreviousSection(section);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar post';
        setError(errorMessage);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    // Salvar que estamos voltando
    sessionStorage.setItem('returningFromPost', 'true');
    
    if (previousSection) {
      router.push(`/${previousSection}`);
    } else {
      router.push('/');
    }
  };

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {error || 'Post não encontrado'}
          </h1>
          <p className="text-gray-600 mb-8">
            O post que você está procurando não foi encontrado ou não está mais disponível.
          </p>
          <button 
            onClick={handleBack}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Voltar para página inicial
          </button>
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

  // Mapear cores das categorias
  const getCategoryColor = (categoria: string) => {
    const colorMap: Record<string, string> = {
      'Agrovia Atual': 'bg-emerald-600',
      'Agrovia Ensina': 'bg-blue-600',
      'Agrovia Legal': 'bg-purple-600',
      'Agrovia Inspira': 'bg-pink-600',
      'Agrovia Conversa': 'bg-orange-600',
      'Guia Agrovia': 'bg-teal-600',
    };
    return colorMap[categoria] || 'bg-emerald-600';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section com imagem de destaque ou gradiente */}
      {post.imagemDestaque ? (
        <section className="relative w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={`${API_BASE_URL}${post.imagemDestaque}`}
              alt={post.nomePost}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          </div>
          
          {/* Botão voltar no hero */}
          <div className="absolute top-6 left-4 md:left-8 z-20">
            <button 
              onClick={handleBack}
              className="group inline-flex items-center gap-2 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl px-5 py-2.5 rounded-xl border border-white/20 text-gray-900 hover:bg-white transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Voltar
            </button>
          </div>

          {/* Conteúdo do hero */}
          <div className={`relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${getCategoryColor(post.nomeCategoria)} text-white text-sm font-semibold mb-6 shadow-lg`}>
              <Sparkles className="h-4 w-4" />
              {post.nomeCategoria}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
              {post.nomePost}
            </h1>
            <div className="flex items-center gap-4 text-emerald-100 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.nomeUsuario}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>{formatDate(post.dataPost)}</time>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800">
          {/* Efeitos decorativos */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>

          {/* Botão voltar */}
          <div className="absolute top-6 left-4 md:left-8 z-20">
            <button 
              onClick={handleBack}
              className="group inline-flex items-center gap-2 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl px-5 py-2.5 rounded-xl border border-white/20 text-gray-900 hover:bg-white transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Voltar
            </button>
          </div>

          {/* Conteúdo do hero */}
          <div className={`relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${getCategoryColor(post.nomeCategoria)} text-white text-sm font-semibold mb-6 shadow-lg`}>
              <Sparkles className="h-4 w-4" />
              {post.nomeCategoria}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
              {post.nomePost}
            </h1>
            <div className="flex items-center gap-4 text-emerald-100 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.nomeUsuario}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>{formatDate(post.dataPost)}</time>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conteúdo do post */}
      <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {/* Descrição */}
        {post.descricao && (
          <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light text-center max-w-3xl mx-auto">
              {post.descricao}
            </p>
          </div>
        )}

        {/* Divisor visual */}
        {post.descricao && (
          <div className="flex justify-center mb-12">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>
        )}

        {/* Conteúdo principal */}
        {post.conteudo && (
          <div className={`prose prose-lg md:prose-xl max-w-none mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div 
              className="text-gray-800 leading-relaxed blog-details"
              dangerouslySetInnerHTML={{ __html: post.conteudo }}
            />
          </div>
        )}

        {/* Imagem do conteúdo */}
        {post.imagemConteudo && (
          <div className={`relative w-full aspect-video my-12 rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Image
              src={`${API_BASE_URL}${post.imagemConteudo}`}
              alt={`Imagem do conteúdo: ${post.nomePost}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}

        {/* Link externo */}
        {post.linkExterno && (
          <div className={`mt-16 p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100 shadow-lg transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-600 rounded-xl text-white">
                <ExternalLink className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Link Relacionado</p>
                <a 
                  href={post.linkExterno}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors"
                >
                  {post.linkExterno}
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Botão voltar no final (se não tiver imagem de destaque) */}
        {!post.imagemDestaque && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-emerald-600"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-2" />
              Voltar
            </button>
          </div>
        )}

        {/* Conteúdo final */}
        {post.conteudoFooter && (
          <div className={`prose prose-lg md:prose-xl max-w-none mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div 
              className="text-gray-800 leading-relaxed blog-details"
              dangerouslySetInnerHTML={{ __html: post.conteudoFooter }}
            />
          </div>
        )}   
        
        {/* Imagem do final */}
        {post.imagemFooter && (
          <div className={`relative w-full aspect-video my-12 rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Image
              src={`${API_BASE_URL}${post.imagemFooter}`}
              alt={`Imagem do conteúdo: ${post.nomePost}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>          
        )}
     
      </article>
    </main>
  );
}
