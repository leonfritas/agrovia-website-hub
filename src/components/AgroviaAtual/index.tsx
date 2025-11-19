"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { usePosts } from "@/hooks/usePosts";
import { getValidImageUrl } from "@/utils/imageUrl";

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
  avatar?: string;
};

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

export default function AgroviaAtualComComentarios() {
  const { posts, loading, error } = usePosts("Agrovia Atual");
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ author: "", text: "" });
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitingComment, setSubmitingComment] = useState(false);

  // quantidade de posts visíveis
  const [visibleCount, setVisibleCount] = useState(3);
  const loadedCountsRef = useRef<Set<number>>(new Set());

  // Carregar contagem de comentários quando os posts carregarem
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => {
        // Só carregar se ainda não carregou
        if (!loadedCountsRef.current.has(post.idPost)) {
          loadedCountsRef.current.add(post.idPost);
          loadCommentsCount(post.idPost);
        }
      });
    }
  }, [posts]); // Incluir posts como dependência

  // Fechar modal com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPostId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const currentComments = useMemo(
    () => (openPostId ? commentsMap[openPostId] ?? [] : []),
    [openPostId, commentsMap]
  );

  const openComments = async (postId: number) => {
    setOpenPostId(postId);
    setForm({ author: "", text: "" });
    
    // Carregar comentários do banco se ainda não foram carregados
    if (!commentsMap[postId]) {
      await loadComments(postId);
    }
  };

  const loadCommentsCount = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comentarios/post/${postId}`, {
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return;

      const data = await response.json();
      setCommentsCount(prev => ({
        ...prev,
        [postId]: data.total || 0
      }));
    } catch (err) {
      console.error('Erro ao carregar contagem de comentários:', err);
    }
  };

  const loadComments = async (postId: number) => {
    try {
      setLoadingComments(true);
      const response = await fetch(`${API_BASE_URL}/api/comentarios/post/${postId}`, {
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }

      const data = await response.json();
      const formattedComments = data.comentarios.map((c: any) => ({
        id: c.idComentario,
        author: c.nomeAutor,
        date: new Date(c.dataComentario).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        text: c.textoComentario
      }));

      setCommentsMap(m => ({
        ...m,
        [postId]: formattedComments
      }));

      // Atualizar contagem também
      setCommentsCount(prev => ({
        ...prev,
        [postId]: data.total || 0
      }));
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeComments = () => setOpenPostId(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openPostId) return;

    const text = form.text.trim();
    if (!text) return;

    const author = form.author.trim() || "Anônimo";

    try {
      setSubmitingComment(true);

      const response = await fetch(`${API_BASE_URL}/api/comentarios`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPost: openPostId,
          nomeAutor: author,
          textoComentario: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro ao enviar comentário');
        return;
      }

      // Se aprovado automaticamente, adicionar à lista
      if (data.status === 'aprovado') {
        const newComment: Comment = {
          id: data.comentario.idComentario,
          author: data.comentario.nomeAutor,
          date: new Date(data.comentario.dataComentario).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          text: data.comentario.textoComentario,
        };

        setCommentsMap((m) => ({
          ...m,
          [openPostId]: [...(m[openPostId] ?? []), newComment],
        }));

        setForm({ author: "", text: "" });
        // Atualizar contagem
        loadCommentsCount(openPostId);
        alert('Comentário publicado com sucesso!');
      } else {
        // Comentário pendente de moderação
        setForm({ author: "", text: "" });
        alert('Seu comentário foi enviado e está aguardando moderação. Obrigado!');
      }
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setSubmitingComment(false);
    }
  };

  const getCount = (postId: number) => commentsCount[postId] ?? 0;

  if (loading) {
    return (
      <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B5B33]"></div>
            <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar conteúdo: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agrovia-atual" className="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        {/* selo */}
        <div>
          <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm text-white">
            Agrovia Atual
          </span>
        </div>

        {/* título grande */}
        {/* <h2 className="mt-20 max-w-5xl text-3xl font-extrabold leading-tight text-black md:text-5xl">
          O que está acontecendo no agro, com linguagem simples.
          <br className="hidden md:block" />
          <span className="block">
            Notícias diárias, tendências e alertas que impactam o produtor rural.
          </span>
        </h2> */}

        {/* grid de cards */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.slice(0, visibleCount).map((post) => {
              // Usar imagem de destaque ou fallback
              const imageUrl = getValidImageUrl(post.imagemDestaque, "/images/agrovia-atual.jpg");
              
              return (
                <article key={post.idPost} className="group">
                  {/* imagem */}
                  <a
                    href={`/post/${post.idPost}`}
                    onClick={(e) => {
                      e.preventDefault();
                      // Salvar posição de scroll
                      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
                      // Navegar
                      window.location.href = `/post/${post.idPost}`;
                    }}
                    className="block overflow-hidden rounded-[28px] relative aspect-[4/3]"
                    aria-label={post.nomePost}
                  >
                    <Image
                      src={imageUrl}
                      alt={post.nomePost}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </a>

                {/* local + comentários */}
                <div className="mt-2 flex items-center gap-6 text-sm text-neutral-700">
                  <span className="inline-flex items-center gap-2">
                    📍 {post.nomeUsuario}
                  </span>
                  <button
                    type="button"
                    onClick={() => openComments(post.idPost)}
                    className="inline-flex items-center gap-2 hover:underline focus:outline-none"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {getCount(post.idPost)} Comentários
                  </button>
                </div>

                {/* título */}
                <h3 className="mt-3 text-lg font-semibold leading-snug text-neutral-900">
                  <a 
                    href={`/post/${post.idPost}`}
                    onClick={(e) => {
                      e.preventDefault();
                      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
                      window.location.href = `/post/${post.idPost}`;
                    }}
                    className="hover:underline"
                  >
                    {post.nomePost}
                  </a>
                </h3>
              </article>
            );
          })
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Nenhum conteúdo disponível no momento.
            </div>
          )}
        </div>

        {/* botão leia mais */}
        {visibleCount < posts.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-white transition hover:opacity-90"
            >
              Leia mais
            </button>
          </div>
        )}
      </div>

      {/* Modal de comentários */}
      {openPostId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenPostId(null);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={closeComments}
              className="absolute right-3 top-3 rounded-full p-1 text-neutral-600 hover:bg-neutral-100"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-neutral-900">
                {posts.find((p) => p.idPost === openPostId)?.nomePost}
              </h4>
              <p className="text-sm text-neutral-500">
                {currentComments.length} comentário(s)
              </p>
            </div>

            {/* comentários */}
            <div className="max-h-80 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
              ) : (
                <>
                  {currentComments.map((c) => (
                    <div key={c.id} className="mb-4 flex gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200" />
                      <div className="rounded-2xl bg-neutral-100 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <span className="font-medium text-neutral-900">{c.author}</span>
                          <span className="text-neutral-500">• {c.date}</span>
                        </div>
                        <p className="text-sm text-neutral-800">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {currentComments.length === 0 && !loadingComments && (
                    <p className="text-sm text-neutral-500">Nenhum comentário ainda. Seja o primeiro!</p>
                  )}
                </>
              )}
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Seu nome (opcional)"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <textarea
                required
                rows={3}
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Escreva aqui…"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!form.text.trim() || submitingComment}
                  className="rounded-full bg-black px-5 py-2 text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitingComment && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitingComment ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
