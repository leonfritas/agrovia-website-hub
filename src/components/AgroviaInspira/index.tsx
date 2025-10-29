"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

interface Depoimento {
  id: number;
  imagem: string;
  video: string;
  titulo: string;
  texto: string;
  produtor: string;
}

export default function AgroviaInspira() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const abrirVideo = (url: string) => {
    setVideoUrl(url);
    setIsOpen(true);
  };

  // Dados fixos dos depoimentos (mantendo o layout original)
  const depoimentos: Depoimento[] = [
    {
      id: 1,
      imagem: "/images/agrovia-inspira1.jpg",
      video: "/videos/agrovia-inspira1.mp4",
      titulo: "Seu João e os filhos",
      texto: "40 anos de produção familiar em Goiás.",
      produtor: "Jorge Santos",
    },
    {
      id: 2,
      imagem: "/images/agrovia-inspira2.jpg",
      video: "/videos/agrovia-inspira2.mp4",
      titulo: "Dona Maria e a cooperativa",
      texto: "Histórias de superação e agricultura sustentável.",
      produtor: "Maria Oliveira",
    },
    {
      id: 3,
      imagem: "/images/agrovia-inspira1.jpg",
      video: "/videos/agrovia-inspira1.mp4",
      titulo: "Agricultura familiar",
      texto: "Tradição e inovação caminhando juntas no campo.",
      produtor: "Carlos Silva",
    },
    {
      id: 4,
      imagem: "/images/agrovia-inspira2.jpg",
      video: "/videos/agrovia-inspira2.mp4",
      titulo: "Sustentabilidade rural",
      texto: "Práticas que preservam o meio ambiente e geram renda.",
      produtor: "Ana Costa",
    },
    {
      id: 5,
      imagem: "/images/agrovia-inspira1.jpg",
      video: "/videos/agrovia-inspira1.mp4",
      titulo: "Tecnologia no campo",
      texto: "Como a tecnologia está transformando a agricultura.",
      produtor: "Roberto Lima",
    },
  ];

  return (
    <section id="agrovia-inspira" className="relative z-10 bg-emerald-900 py-16 lg:py-24">
      <div className="container mx-auto">
        {/* Título */}
        <div className="mb-8">
          <span className="px-4 py-1 rounded-md bg-[#7B5B33] text-white text-sm">
            Agrovia Inspira
          </span>
        </div>

        {/* Carrossel */}
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}          
          className="relative agrovia-swiper" 
        >
          {depoimentos.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Imagem */}
                <div className="relative w-full max-w-[820px]">
                  <Image
                    src={item.imagem}
                    alt={item.titulo}
                    width={720}
                    height={650}
                    className="rounded-2xl object-cover"
                  />
                  {/* Miniatura com botão play */}
                  <div className="absolute bottom-8 right-10 aspect-square w-80 rounded-xl shadow-lg">
                    <Image
                      src={item.imagem}
                      alt={`${item.titulo} vídeo`}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => abrirVideo(item.video)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-black/70 text-yellow-400 hover:scale-110 transition"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>

                {/* Texto */}
                <div className="flex-1 text-white">
                  {/* Estrelas */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  {/* Texto */}
                  <p className="text-lg italic mb-4">
                    "{item.titulo}: {item.texto}"
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Produtor</span>
                    <br />
                    {item.produtor}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botões de navegação */}
        <div className="flex justify-end gap-4">
          <button className="prev-btn w-10 h-10 flex items-center justify-center rounded-full bg-white text-emerald-900 hover:bg-gray-200">
            <ArrowLeft />
          </button>
          <button className="next-btn w-10 h-10 flex items-center justify-center rounded-full bg-white text-emerald-900 hover:bg-gray-200">
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Modal com vídeo */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-36 right-6 text-white hover:text-gray-400 z-[60]"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-[90%] max-w-3xl bg-black rounded-xl shadow-lg z-[50]">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}