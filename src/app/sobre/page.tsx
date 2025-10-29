"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SobrePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] flex flex-col items-center justify-center bg-green-900">
        {/* Imagem de fundo */}
        {/* <div className="absolute inset-0">
          <Image
            src="/images/campo.jpg" // coloque uma imagem de fundo do agro
            alt="Campo"
            fill
            className="object-cover opacity-40"
          />
        </div> */}

        {/* Logo + Título */}
        <div className="relative flex flex-col items-center text-center">
          <Image
            src="/images/logo/logov-white.png" // sua logo
            alt="Agrovia Logo"
            width={120}
            height={120}
            className="mb-4 drop-shadow-lg"
          />
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            Mais sobre a Agrovia
          </h1>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
          A Agrovia é um hub digital criado para conectar produtores, especialistas
          e empresas do agronegócio. Nosso propósito é trazer informação, tecnologia,
          segurança e visão de futuro para o campo.
        </p>

        {/* Cards Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <Image
              src="/images/Sobre/miss.jpg"
              alt="Missão"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Missão</h3>
            <p className="text-gray-600">
              Impulsionar o agronegócio brasileiro com informação confiável,
              acessível e moderna.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <Image
              src="/images/Sobre/visao.jpg"
              alt="Visão"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Visão</h3>
            <p className="text-gray-600">
              Ser a principal plataforma digital que conecta e apoia o
              desenvolvimento do agro no Brasil.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <Image
              src="/images/Sobre/valore.jpg"
              alt="Valores"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Valores</h3>
            <p className="text-gray-600">
              Compromisso com a sustentabilidade, inovação, ética e proximidade
              com o produtor.
            </p>
          </div>
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
