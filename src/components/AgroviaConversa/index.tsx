"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Conversa = {
  id: number;
  bg: string;
  foto: string;
  titulo: string;
  resumo: string;
  cargo: string;
  nome: string;
  video: string;
};

export default function AgroviaConversa() {
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [active, setActive] = useState(0);

  // refs p/ medir onde começa o slider
  const sectionRef = useRef<HTMLElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [bgTop, setBgTop] = useState(0);

  // mede e atualiza em resize
  useEffect(() => {
    const measure = () => {
      if (sectionRef.current && bandRef.current) {
        const top =
          bandRef.current.getBoundingClientRect().top -
          sectionRef.current.getBoundingClientRect().top;
        setBgTop(Math.max(0, Math.round(top)));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const abrirVideo = (url: string) => {
    setVideoUrl(url);
    setOpen(true);
  };

  // Dados fixos das conversas (mantendo o layout original)
  const conversas: Conversa[] = [
    {
      id: 1,
      bg: "/images/agrovia-conversa-bg.jpg",
      foto: "/images/agrovia-conversa1.jpg",
      titulo: "Eng. Florestal Carlos Prado fala sobre reflorestamento e mercado de carbono.",
      resumo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
      cargo: "Eng. Florestal",
      nome: "Carlos Prado",
      video: "/videos/agrovia-conversa-1.mp4",
    },
    {
      id: 2,
      bg: "/images/agrovia-conversa-bg.jpg",
      foto: "/images/agrovia-conversa2.jpg",
      titulo: "Profa. Marina Souza comenta práticas de ILPF no Centro-Oeste.",
      resumo: "Conteúdo introdutório sobre Integração Lavoura-Pecuária-Floresta, desafios e ganhos de produtividade no médio prazo.",
      cargo: "Pesquisadora",
      nome: "Marina Souza",
      video: "/videos/agrovia-conversa-1.mp4",
    },
    {
      id: 3,
      bg: "/images/agrovia-conversa-bg.jpg",
      foto: "/images/agrovia-conversa1.jpg",
      titulo: "Dr. Roberto Lima discute sustentabilidade na agricultura moderna.",
      resumo: "Abordagem sobre práticas sustentáveis que podem ser implementadas em diferentes tipos de propriedades rurais.",
      cargo: "Pesquisador",
      nome: "Roberto Lima",
      video: "/videos/agrovia-conversa-1.mp4",
    },
    {
      id: 4,
      bg: "/images/agrovia-conversa-bg.jpg",
      foto: "/images/agrovia-conversa2.jpg",
      titulo: "Ana Costa fala sobre cooperativismo e agricultura familiar.",
      resumo: "Como o cooperativismo pode fortalecer a agricultura familiar e gerar mais oportunidades de negócio.",
      cargo: "Coordenadora",
      nome: "Ana Costa",
      video: "/videos/agrovia-conversa-1.mp4",
    },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="agrovia-conversa"
      ref={sectionRef}
      className="relative z-10 bg-emerald-900/95 py-12 md:py-16 lg:py-20"
    >
      {/* CAMADA DE BACKGROUND: ocupa a section inteira em largura,
          mas começa NO PONTO onde o slider inicia (bgTop). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
        style={{ top: `${bgTop}px` }}
      >
        <div className="relative h-full min-h-[420px]">
          <Image
            src={conversas[active]?.bg || "/images/agrovia-conversa-bg.jpg"}
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
          {/* scrim na metade direita */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/35 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* selo */}
        <div>
          <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm text-white">
            Agrovia Conversa
          </span>
        </div>

        {/* título (SEM bg por trás) */}
        <h2 className="mt-6 max-w-5xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
          Diálogos que aproximam o saber da prática.
          <br className="hidden md:block" />
          <span className="block">
            Entrevistas com quem vive, ensina e transforma o agro.
          </span>
        </h2>

        {/* WRAPPER DO SLIDER (usa ref para ancorar o BG) */}
        <div ref={bandRef} className="relative mt-10 rounded-2xl overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            navigation={{ prevEl: ".conversa-prev", nextEl: ".conversa-next" }}
            pagination={{ clickable: true }}
            onSlideChange={(s) => setActive(s.activeIndex)}
            className="conversa-swiper relative min-h-[520px] rounded-2xl overflow-hidden"
          >
            {conversas.map((c) => (
              <SwiperSlide key={c.id}>
                {/* conteúdo */}
                <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-8 md:flex-row">
                  {/* FOTO à esquerda */}
                  <div className="relative w-full max-w-[520px] ">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-2xl">
                      <Image
                        src={c.foto}
                        alt={c.nome}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 40vw, 90vw"
                      />
                      {/* botão play */}
                      <button
                        onClick={() => abrirVideo(c.video)}
                        aria-label="Reproduzir entrevista"
                        className="absolute bottom-6 left-6 grid h-14 w-14 place-items-center rounded-full bg-black/70 transition hover:scale-105"
                      >
                        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#F6A623]">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* TEXTO à direita */}
                  <div className="relative z-10 -mt-2 w-full text-white md:mt-0 md:flex-1">
                    <h3 className="mb-4 max-w-2xl text-xl font-extrabold md:text-2xl">
                      {c.titulo}
                    </h3>
                    <p className="mb-6 max-w-2xl text-white/90">{c.resumo}</p>

                    <div className="mt-6">
                      <div className="h-px w-16 bg-white/70" />
                      <p className="mt-3 text-sm font-semibold">{c.cargo}</p>
                      <p className="text-sm text-white/90">{c.nome}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* setas */}
          <div className="pointer-events-none absolute bottom-4 right-4 z-20 flex gap-3">
            <button
              className="conversa-prev pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-900 shadow-md transition hover:bg-gray-100"
              aria-label="Anterior"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              className="conversa-next pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-900 shadow-md transition hover:bg-gray-100"
              aria-label="Próximo"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE VÍDEO */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => e.currentTarget === e.target && setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-6 top-32 text-white hover:text-gray-300"
            aria-label="Fechar"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl">
            <video src={videoUrl} controls autoPlay className="w-full" />
          </div>
        </div>
      )}
    </section>
  );
}