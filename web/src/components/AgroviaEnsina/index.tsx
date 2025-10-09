
"use client";

import AgroviaEnsinaCard from "./AgroviaEnsinaCard";
import { usePosts } from "@/hooks/usePosts";

const AgroviaEnsina = () => {
  const { posts, loading, error } = usePosts("Agrovia Ensina");

  if (loading) {
    return (
      <section id="agrovia-ensina" className="pb-10 pt-10 lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
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
      <section id="agrovia-ensina" className="pb-10 pt-10 lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar conteúdo: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agrovia-ensina" className="pb-10 pt-10 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        {/* Badge */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm font-medium text-white mb-10 lg:mb-24">
          Agrovia Ensina
        </span>

        {/* Título */}
        <h2 className="mb-12 lg:mb-24 max-w-3xl text-2xl font-bold leading-snug text-dark sm:text-3xl lg:text-4xl">
          Técnicas que aumentam sua produtividade com o pé no chão. <br />
          <span className="block">
            Conteúdos técnicos e aplicáveis com linguagem descomplicada.
          </span>
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">                    
          {posts.length > 0 ? (
            posts.map((post, i) => {
              // Se a imagem começa com /uploads, usar o servidor da API
              // Caso contrário, é uma imagem local do frontend
              const imageUrl = post.imagemPost 
                ? (post.imagemPost.startsWith('/uploads/') 
                    ? `http://localhost:3001${post.imagemPost}` 
                    : post.imagemPost)
                : "/images/icon.png";
              
              return (
                <AgroviaEnsinaCard 
                  key={post.idPost} 
                  agroviaensina={{
                    id: post.idPost,
                    title: post.nomePost,
                    subtitle: post.descricao,
                    icon: imageUrl,
                    link: `/post/${post.idPost}`
                  }} 
                />
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Nenhum conteúdo disponível no momento.
            </div>
          )}                    
        </div>
      </div>
    </section>
  );
};

export default AgroviaEnsina;
