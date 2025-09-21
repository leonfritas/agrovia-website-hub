"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Post = {
  id: number;
  title: string;
  image: string;
  location: string;
  href: string;
};

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
  avatar?: string;
};

const posts: Post[] = [
  {
    id: 1,
    title: "Nova linha de crédito rural: o que muda?",
    image: "/images/agrovia-atual.jpg",
    location: "Diamantino",
    href: "/noticias/1",
  },
  {
    id: 2,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna aliqua.",
    image: "/images/agrovia-atual.jpg",
    location: "Diamantino",
    href: "/noticias/2",
  },
  {
    id: 3,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna aliqua.",
    image: "/images/agrovia-atual.jpg",
    location: "Diamantino",
    href: "/noticias/3",
  },
];

/** Mock inicial — você pode trocar por fetch depois */
const initialComments: Record<number, Comment[]> = {
  1: [
    { id: 11, author: "Ana Paula", date: "12 set 2025", text: "Excelente iniciativa para pequenos produtores." },
    { id: 12, author: "Carlos Mendes", date: "13 set 2025", text: "Como fica a taxa de juros para quem já possui custeio?" },
  ],
  2: [{ id: 21, author: "Marcos", date: "10 set 2025", text: "Ótimo resumo!" }],
  3: [],
};

export default function AgroviaAtualComComentarios() {
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>(initialComments);
  const [form, setForm] = useState({ author: "", text: "" });

  // Fechar com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPostId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const currentComments = useMemo(
    () => (openPostId ? commentsMap[openPostId] ?? [] : []),
    [openPostId, commentsMap]
  );

  const openComments = (postId: number) => {
    setOpenPostId(postId);
    setForm({ author: "", text: "" });
  };

  const closeComments = () => setOpenPostId(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openPostId) return;

    const text = form.text.trim();
    if (!text) return;

    const author = form.author.trim() || "Anônimo";
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

    const newComment: Comment = {
      id: Number(`${openPostId}${now.getTime()}`),
      author,
      date,
      text,
    };

    setCommentsMap((m) => ({
      ...m,
      [openPostId]: [...(m[openPostId] ?? []), newComment],
    }));

    setForm({ author: "", text: "" });
  };

  const getCount = (postId: number) => (commentsMap[postId]?.length ?? 0);

  return (
    <section
      id="agrovia-atual"
      className="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        {/* selo */}
        <div>
          <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm text-white">
            Agrovia Atual
          </span>
        </div>

        {/* título grande */}
        <h2 className="mt-20 max-w-5xl text-3xl font-extrabold leading-tight text-black md:text-5xl">
          O que está acontecendo no agro, com linguagem simples.
          <br className="hidden md:block" />
          <span className="block">
            Notícias diárias, tendências e alertas que impactam o produtor rural.
          </span>
        </h2>

        {/* grid de cards */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group">
              {/* imagem */}
              <Link
                href={post.href}
                className="block overflow-hidden rounded-[28px] relative aspect-[4/3]"
                aria-label={post.title}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                />
              </Link>

              {/* metadados */}
              <div className="mt-4 text-xs text-neutral-500">Categorias</div>
              <div className="mt-2 flex items-center gap-6 text-sm text-neutral-700">
                <span className="inline-flex items-center gap-2">
                  {/* ícone local */}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
                  {post.location}
                </span>

                {/* Botão de comentários */}
                <button
                  type="button"
                  onClick={() => openComments(post.id)}
                  className="inline-flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded-md"
                  aria-haspopup="dialog"
                  aria-controls="comments-dialog"
                  aria-expanded={openPostId === post.id}
                >
                  <MessageCircle className="h-4 w-4" />
                  {getCount(post.id)} Comentários
                </button>
              </div>

              {/* título da notícia */}
              <h3 className="mt-3 text-lg font-semibold leading-snug text-neutral-900">
                <Link href={post.href} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>

        {/* botão leia mais */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/noticias"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-white transition hover:opacity-90"
          >
            Leia mais
          </Link>
        </div>
      </div>

      {/* MODAL DE COMENTÁRIOS + FORM */}
      {openPostId !== null && (
        <div
          id="comments-dialog"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenPostId(null);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-4 md:p-6 shadow-xl">
            {/* fechar */}
            <button
              onClick={closeComments}
              className="absolute right-3 top-3 rounded-full p-1 text-neutral-600 hover:bg-neutral-100"
              aria-label="Fechar comentários"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Cabeçalho */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-neutral-900">
                {posts.find((p) => p.id === openPostId)?.title}
              </h4>
              <p className="text-sm text-neutral-500">
                {currentComments.length} comentário(s)
              </p>
            </div>

            {/* Lista de comentários */}
            <div className="max-h-80 overflow-y-auto pr-1">
              {currentComments.map((c) => (
                <div key={c.id} className="mb-4 flex gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200" />
                  <div className="rounded-2xl bg-neutral-100 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm">
                      <span className="font-medium text-neutral-900">{c.author}</span>
                      <span className="text-neutral-500">• {c.date}</span>
                    </div>
                    <p className="text-sm text-neutral-800">{c.text}</p>
                  </div>
                </div>
              ))}

              {currentComments.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhum comentário ainda.</p>
              )}
            </div>

            {/* Formulário para novo comentário */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-neutral-700">Seu nome</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Opcional"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-neutral-700">Comentário</label>
                  <textarea
                    required
                    rows={3}
                    value={form.text}
                    onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Escreva aqui…"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
                  disabled={!form.text.trim()}
                >
                  Enviar comentário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
