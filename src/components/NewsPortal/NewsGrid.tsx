"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, MessageCircle } from "lucide-react";
import { getValidImageUrl } from "@/utils/imageUrl";

interface Post {
  idPost: number;
  nomePost: string;
  descricao?: string;
  imagemDestaque?: string;
  dataPost: string;
  nomeUsuario?: string;
  categoria?: {
    nomeCategoria: string;
  };
}

interface NewsGridProps {
  posts: Post[];
  commentsCount?: Record<number, number>;
  onCommentClick?: (postId: number) => void;
}

export default function NewsGrid({
  posts,
  commentsCount = {},
  onCommentClick,
}: NewsGridProps) {
  const getCount = (postId: number) => commentsCount[postId] ?? 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const imageUrl = getValidImageUrl(
          post.imagemDestaque,
          "/images/agrovia-atual.jpg"
        );

        const formattedDate = new Date(post.dataPost).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        return (
          <article
            key={post.idPost}
            className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
          >
            <Link
              href={`/post/${post.idPost}`}
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.setItem(
                  "scrollPosition",
                  window.scrollY.toString()
                );
                window.location.href = `/post/${post.idPost}`;
              }}
              className="block"
            >
              {/* Imagem */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={post.nomePost}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.categoria && (
                  <div className="absolute left-2 top-2">
                    <span className="inline-block rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                      {post.categoria.nomeCategoria}
                    </span>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                  {post.nomeUsuario && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.nomeUsuario}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600">
                  {post.nomePost}
                </h3>

                {post.descricao && (
                  <p className="mb-3 line-clamp-2 flex-1 text-sm text-gray-600">
                    {post.descricao}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onCommentClick) {
                        onCommentClick(post.idPost);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-emerald-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {getCount(post.idPost)} comentários
                  </button>
                  <span className="text-xs font-semibold text-emerald-600">
                    Ler mais →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

