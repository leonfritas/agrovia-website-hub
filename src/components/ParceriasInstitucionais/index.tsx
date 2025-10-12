"use client";

import Image from "next/image";

type Logo = { src: string; alt: string; width: number; height: number };

const LOGOS: Logo[] = [
  { src: "/images/logo/logo-white.png",    alt: "Agrovia — O ponto de encontro do agro", width: 220, height: 72 },
  { src: "/logos/piracema.png",   alt: "Piracema — Consultoria Ambiental e Serviços",       width: 220, height: 72 },
  { src: "/logos/manaus.png",     alt: "Prefeitura de Manaus — O trabalho não para",        width: 240, height: 72 },
  { src: "/logos/amazonas.png",   alt: "Governo do Estado do Amazonas",                     width: 240, height: 72 },
];

export default function ParceriasInstitucionais() {
  return (
    <section className="relative z-10 bg-emerald-900 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Parcerias institucionais</h2>

        <ul className="flex flex-wrap items-center justify-between gap-10 md:gap-16">
          {LOGOS.map((l) => (
            <li key={l.alt} className="shrink-0">
              <Image
                src={l.src}
                alt={l.alt}
                width={l.width}
                height={l.height}
                className="max-h-16 w-auto object-contain opacity-95 transition hover:opacity-100"
                sizes="(min-width:1024px) 22vw, 40vw"
                priority={false}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
