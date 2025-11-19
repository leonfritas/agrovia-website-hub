"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, MessageCircle, ArrowRight } from "lucide-react";
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

interface CategorySectionProps {
  title: string;
  badge: string;
  badgeColor?: string;
  posts: Post[];
  commentsCount?: Record<number, number>;
  onCommentClick?: (postId: number) => void;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export default function CategorySection({
  title,
  badge,
  badgeColor = "bg-emerald-600",
  posts,
  commentsCount = {},
  onCommentClick,
  showViewAll = false,
  viewAllLink,
}: CategorySectionProps) {
  const getCount = (postId: number) => commentsCount[postId] ?? 0;

  if (posts.length === 0) {
    return null;
  }

  // Primeiro post como destaque
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-gray-200 pb-4">
          <div>
            <span
              className={`inline-block rounded-md ${badgeColor} px-4 py-1.5 text-sm font-semibold text-white`}
            >
              {badge}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
              {title}
            </h2>
          </div>
          {showViewAll && viewAllLink && (
            <Link
              href={viewAllLink}
              className="hidden items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 md:flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Destaque principal */}
          {featuredPost && (
            <div className="lg:col-span-8">
              <article className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl">
                <Link
                  href={`/post/${featuredPost.idPost}`}
                  onClick={(e) => {
                    e.preventDefault();
                    sessionStorage.setItem(
                      "scrollPosition",
                      window.scrollY.toString()
                    );
                    window.location.href = `/post/${featuredPost.idPost}`;
                  }}
                  className="block"
                >
                  <div className="relative h-[350px] w-full overflow-hidden md:h-[450px]">
                    <Image
                      src={getValidImageUrl(
                        featuredPost.imagemDestaque,
                        "/images/agrovia-atual.jpg"
                      )}
                      alt={featuredPost.nomePost}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm opacity-90">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.dataPost).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                        {featuredPost.nomeUsuario && (
                          <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            {featuredPost.nomeUsuario}
                          </span>
                        )}
                      </div>

                      <h3 className="mb-3 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                        {featuredPost.nomePost}
                      </h3>

                      {featuredPost.descricao && (
                        <p className="mb-4 line-clamp-2 text-base opacity-95 md:text-lg">
                          {featuredPost.descricao}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 font-semibold text-emerald-400 transition-transform group-hover:translate-x-1">
                          Ler mais
                          <ArrowRight className="h-4 w-4" />
                        </span>
                        {onCommentClick && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onCommentClick(featuredPost.idPost);
                            }}
                            className="flex items-center gap-1.5 text-sm opacity-90 hover:opacity-100"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {getCount(featuredPost.idPost)} comentários
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          )}

          {/* Posts secundários */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {secondaryPosts.map((post) => {
                const imageUrl = getValidImageUrl(
                  post.imagemDestaque,
                  "/images/agrovia-atual.jpg"
                );

                return (
                  <article
                    key={post.idPost}
                    className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
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
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={imageUrl}
                            alt={post.nomePost}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex-1 py-1">
                          <h4 className="mb-2 line-clamp-2 text-sm font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600">
                            {post.nomePost}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.dataPost).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                            {onCommentClick && (
                              <>
                                <span>•</span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onCommentClick(post.idPost);
                                  }}
                                  className="flex items-center gap-1 hover:text-emerald-600"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  {getCount(post.idPost)}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Link ver mais */}
            {showViewAll && viewAllLink && posts.length > 4 && (
              <div className="mt-6">
                <Link
                  href={viewAllLink}
                  className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  Ver mais notícias
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Grid de posts adicionais (se houver mais de 4) */}
        {posts.length > 4 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(4, 7).map((post) => {
              const imageUrl = getValidImageUrl(
                post.imagemDestaque,
                "/images/agrovia-atual.jpg"
              );

              return (
                <article
                  key={post.idPost}
                  className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
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
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.nomePost}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.dataPost).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>

                      <h4 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600">
                        {post.nomePost}
                      </h4>

                      {post.descricao && (
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {post.descricao}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

