"use client";

import { useState, useEffect, useRef } from "react";
import { usePosts, useCategorias } from "@/hooks/usePosts";
import FeaturedNews from "./FeaturedNews";
import NewsGrid from "./NewsGrid";
import NewsSidebar from "./NewsSidebar";
import { MessageCircle, X } from "lucide-react";

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
};

const getApiBaseUrl = () => {
  let baseUrl = "";
  if (process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      baseUrl = baseUrl.replace("https://", "http://");
    }
  } else {
    if (typeof window !== "undefined") {
      baseUrl = "http://localhost:4000";
    } else {
      baseUrl = "http://localhost:4000";
    }
  }
  return baseUrl.replace(/\/api$/, "");
};

const API_BASE_URL = getApiBaseUrl();

export default function NewsHomepage() {
  const { posts, loading, error } = usePosts("Agrovia Atual");
  const { categorias } = useCategorias();
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>(
    {}
  );
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>(
    {}
  );
  const [form, setForm] = useState({ author: "", text: "" });
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitingComment, setSubmitingComment] = useState(false);
  const loadedCountsRef = useRef<Set<number>>(new Set());

  // Post em destaque (primeiro da lista)
  const featuredPost = posts.length > 0 ? posts[0] : null;
  // Posts secundários (resto)
  const secondaryPosts = posts.slice(1, 10);
  // Posts recentes para sidebar
  const recentPosts = posts.slice(0, 5);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        if (!loadedCountsRef.current.has(post.idPost)) {
          loadedCountsRef.current.add(post.idPost);
          loadCommentsCount(post.idPost);
        }
      });
    }
  }, [posts]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpenPostId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loadCommentsCount = async (postId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comentarios/post/${postId}`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) return;
      const data = await response.json();
      setCommentsCount((prev) => ({
        ...prev,
        [postId]: data.total || 0,
      }));
    } catch (err) {
      console.error("Erro ao carregar contagem de comentários:", err);
    }
  };

  const loadComments = async (postId: number) => {
    try {
      setLoadingComments(true);
      const response = await fetch(
        `${API_BASE_URL}/api/comentarios/post/${postId}`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao carregar comentários");
      const data = await response.json();
      const formattedComments = data.comentarios.map((c: any) => ({
        id: c.idComentario,
        author: c.nomeAutor,
        date: new Date(c.dataComentario).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        text: c.textoComentario,
      }));
      setCommentsMap((m) => ({
        ...m,
        [postId]: formattedComments,
      }));
      setCommentsCount((prev) => ({
        ...prev,
        [postId]: data.total || 0,
      }));
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const openComments = async (postId: number) => {
    setOpenPostId(postId);
    setForm({ author: "", text: "" });
    if (!commentsMap[postId]) {
      await loadComments(postId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openPostId) return;
    const text = form.text.trim();
    if (!text) return;
    const author = form.author.trim() || "Anônimo";
    try {
      setSubmitingComment(true);
      const response = await fetch(`${API_BASE_URL}/api/comentarios`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPost: openPostId,
          nomeAutor: author,
          textoComentario: text,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Erro ao enviar comentário");
        return;
      }
      if (data.status === "aprovado") {
        const newComment: Comment = {
          id: data.comentario.idComentario,
          author: data.comentario.nomeAutor,
          date: new Date(data.comentario.dataComentario).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
          text: data.comentario.textoComentario,
        };
        setCommentsMap((m) => ({
          ...m,
          [openPostId]: [...(m[openPostId] ?? []), newComment],
        }));
        setForm({ author: "", text: "" });
        loadCommentsCount(openPostId);
        alert("Comentário publicado com sucesso!");
      } else {
        setForm({ author: "", text: "" });
        alert(
          "Seu comentário foi enviado e está aguardando moderação. Obrigado!"
        );
      }
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
      alert("Erro ao enviar comentário. Tente novamente.");
    } finally {
      setSubmitingComment(false);
    }
  };

  const currentComments =
    openPostId !== null ? commentsMap[openPostId] ?? [] : [];

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Carregando notícias...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Erro ao carregar conteúdo: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-emerald-600 pb-4">
          <div>
            <span className="inline-block rounded-md bg-emerald-600 px-4 py-1 text-sm font-semibold text-white">
              Agrovia Atual
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Últimas Notícias do Agronegócio
            </h2>
          </div>
        </div>

        {/* Layout principal: Destaque + Grid + Sidebar */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Coluna principal */}
          <div className="lg:col-span-8">
            {/* Destaque principal */}
            {featuredPost && (
              <div className="mb-8">
                <FeaturedNews post={featuredPost} />
              </div>
            )}

            {/* Grid de notícias secundárias */}
            {secondaryPosts.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Mais Notícias
                </h3>
                <NewsGrid
                  posts={secondaryPosts}
                  commentsCount={commentsCount}
                  onCommentClick={openComments}
                />
              </div>
            )}

            {posts.length === 0 && (
              <div className="rounded-lg bg-white p-12 text-center shadow-md">
                <p className="text-gray-500">
                  Nenhuma notícia disponível no momento.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <NewsSidebar
              recentPosts={recentPosts}
              categories={categorias}
            />
          </div>
        </div>
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
              onClick={() => setOpenPostId(null)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {posts.find((p) => p.idPost === openPostId)?.nomePost}
              </h4>
              <p className="text-sm text-gray-500">
                {currentComments.length} comentário(s)
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {currentComments.map((c) => (
                    <div key={c.id} className="mb-4 flex gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                      <div className="rounded-2xl bg-gray-100 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900">
                            {c.author}
                          </span>
                          <span className="text-gray-500">• {c.date}</span>
                        </div>
                        <p className="text-sm text-gray-800">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {currentComments.length === 0 && !loadingComments && (
                    <p className="text-sm text-gray-500">
                      Nenhum comentário ainda. Seja o primeiro!
                    </p>
                  )}
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                placeholder="Seu nome (opcional)"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <textarea
                required
                rows={3}
                value={form.text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, text: e.target.value }))
                }
                placeholder="Escreva aqui…"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!form.text.trim() || submitingComment}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitingComment && (
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  )}
                  {submitingComment ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

