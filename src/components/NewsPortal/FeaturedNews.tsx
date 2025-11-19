"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
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

interface FeaturedNewsProps {
  post: Post;
}

export default function FeaturedNews({ post }: FeaturedNewsProps) {
  const imageUrl = getValidImageUrl(
    post.imagemDestaque,
    "/images/agrovia-atual.jpg"
  );

  const formattedDate = new Date(post.dataPost).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl">
      <Link
        href={`/post/${post.idPost}`}
        onClick={(e) => {
          e.preventDefault();
          sessionStorage.setItem("scrollPosition", window.scrollY.toString());
          window.location.href = `/post/${post.idPost}`;
        }}
        className="block"
      >
        {/* Imagem de destaque */}
        <div className="relative h-[400px] w-full overflow-hidden md:h-[500px]">
          <Image
            src={imageUrl}
            alt={post.nomePost}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Badge de categoria */}
          {post.categoria && (
            <div className="absolute left-4 top-4">
              <span className="inline-block rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white">
                {post.categoria.nomeCategoria}
              </span>
            </div>
          )}

          {/* Conteúdo sobre a imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              {post.nomeUsuario && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.nomeUsuario}
                </span>
              )}
            </div>
            
            <h2 className="mb-3 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {post.nomePost}
            </h2>
            
            {post.descricao && (
              <p className="mb-4 line-clamp-2 text-base opacity-95 md:text-lg">
                {post.descricao}
              </p>
            )}
            
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-400 transition-transform group-hover:translate-x-1">
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

