"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

type Pin = { id: string; top: string; left: string; label?: string };

/** Ajuste as posições em % conforme sua arte do mapa */
const PINS: Pin[] = [
  { id: "am", top: "40%", left: "28%", label: "Manaus" },
  { id: "ro", top: "67%", left: "19%" },
  { id: "df", top: "66%", left: "49%" },
  { id: "mg", top: "63%", left: "58%" },
  { id: "rs", top: "86%", left: "55%" },
];

export default function GuiaAgrovia() {
  return (
    <section id="guia-agrovia" className="relative z-10 bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Selo */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm text-white">
          Guia Agrovia
        </span>

        {/* Título */}
        <h2 className="mt-6 max-w-4xl text-3xl font-extrabold leading-tight text-black md:text-5xl">
          Produtos, serviços e eventos confiáveis para quem vive do campo.
          <br className="hidden md:block" />
          <span className="block">
            Uma curadoria de soluções práticas com especialistas parceiros.
          </span>
        </h2>

        {/* Área do mapa + card de texto */}
        <div className="relative mx-auto mt-10 w-full max-w-5xl lg:ml-auto">
          {/* MAPA */}
          <div className="relative aspect-[16/11] overflow-visible rounded-2xl">
            {/* sua arte do mapa (SVG ou PNG) */}
            <Image
              src="/images/brasil-map.png" // coloque o arquivo em /public/images/
              alt="Mapa do Brasil"
              fill
              className="object-contain"
              priority={false}
            />

            {/* Destaque do estado (ex.: Amazonas) – ajuste o polígono para casar com sua arte */}
            {/* <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <clipPath id="estado-destaque">                    
                    <polygon points="8,35 28,33 42,45 35,60 16,57 11,47" />
                  </clipPath>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  clipPath="url(#estado-destaque)"
                  fill="#2F6B47"
                  opacity="0.85"
                />
              </svg>
            </div> */}

            {/* Pins */}
            {/* {PINS.map((p) => (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: p.top, left: p.left }}
                title={p.label}
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-black/80 shadow-sm ring-1 ring-black/30">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            ))} */}
          </div>

          {/* Card de texto (fica “fora” do mapa à esquerda em telas grandes) */}
          <div className="mt-8 max-w-md lg:absolute lg:-left-10 lg:bottom-4">
            <h3 className="text-base font-semibold text-neutral-900">
              Lorem ipsum dolor sit amet,
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis.
            </p>
            <Link
              href="/guia"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-white transition hover:opacity-90"
            >
              Veja mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
