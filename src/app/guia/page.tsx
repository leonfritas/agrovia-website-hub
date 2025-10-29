"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GuiaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] flex flex-col items-center justify-center bg-green-900">      

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
            Guia Agrovia
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
              src="/images/Agrovia-Guia/guia1.jpg"
              alt="Missão"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Empresas e Soluções do Campo</h3>
            <p className="text-gray-600">
              Conheça quem impulsiona o agro com inovação e responsabilidade.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <Image
              src="/images/Agrovia-Guia/guia2.jpg"
              alt="Visão"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Feiras, Cursos e Eventos Rurais</h3>
            <p className="text-gray-600">
              Fique por dentro das oportunidades que conectam o campo e o conhecimento.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <Image
              src="/images/Agrovia-Guia/guia3.jpg"
              alt="Valores"
              width={400}
              height={250}
              className="rounded-lg mb-4 object-cover w-full h-48"
            />
            <h3 className="text-xl font-bold text-green-900 mb-2">Especialistas e Parcerias Locais</h3>
            <p className="text-gray-600">
              Conte com quem entende o campo — parcerias que fortalecem sua produção.
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
