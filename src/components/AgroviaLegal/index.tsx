"use client";

import AgroviaEnsinaCard from "../AgroviaEnsina/AgroviaEnsinaCard";
import { usePosts } from "@/hooks/usePosts";
import { getValidImageUrl } from "@/utils/imageUrl";

const AgroviaLegal = () => {
  const { posts, loading, error } = usePosts("Agrovia Legal");

  if (loading) {
    return (
      <section id="agrovia-legal" className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
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
      <section id="agrovia-legal" className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar conteúdo: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agrovia-legal" className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        {/* Badge */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm font-medium text-white mb-10 lg:mb-24">
          Agrovia Legal
        </span>

        {/* Título */}
        <h2 className="mb-10 lg:mb-24 max-w-3xl text-2xl font-bold leading-snug text-dark sm:text-3xl lg:text-4xl">
          
          Seu direito no campo, explicado de forma clara.

          <br />
          <span className="block">
            Dúvidasjurídicas traduzidas por quem entende do agro
          </span>
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">                    
          {posts.length > 0 ? (
            posts.map((post, i) => {
              // Usar imagem de destaque ou fallback
              const imageUrl = getValidImageUrl(post.imagemDestaque, "/images/icon.png");
              
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

export default AgroviaLegal;
