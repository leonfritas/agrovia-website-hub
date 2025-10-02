"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InfoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] flex flex-col items-center justify-center bg-green-900">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <Image
            src="/images/campo.jpg" // pode ser a mesma ou outra imagem
            alt="Campo"
            fill
            className="object-cover opacity-40"
          />
        </div>

        {/* Logo + Título */}
        <div className="relative flex flex-col items-center text-center">
          <Image
            src="/images/logo/logov.png"
            alt="Agrovia Logo"
            width={120}
            height={120}
            className="mb-4 drop-shadow-lg"
          />
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            Título da Página de Detalhes
          </h1>
        </div>
      </section>

      {/* Texto principal */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-lg text-gray-700 leading-relaxed">
          Confira alguns dos momentos mais marcantes da Agrovia em imagens que
          retratam nosso compromisso com o agronegócio, a inovação e a
          sustentabilidade no campo.
        </p>
      </section>

      {/* Galeria de Imagens */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition">
          <Image
            src="/images/galeria1.jpg"
            alt="Evento Agrovia"
            width={400}
            height={300}
            className="object-cover w-full h-64"
          />
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition">
          <Image
            src="/images/galeria2.jpg"
            alt="Tecnologia no campo"
            width={400}
            height={300}
            className="object-cover w-full h-64"
          />
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition">
          <Image
            src="/images/galeria3.jpg"
            alt="Sustentabilidade"
            width={400}
            height={300}
            className="object-cover w-full h-64"
          />
        </div>
      </section>

      {/* Botão voltar */}
      <div className="flex justify-center pb-12">
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-green-900 text-white rounded-md font-semibold hover:bg-green-700 transition"
        >
          Voltar
        </button>
      </div>
    </main>
  );
}
