"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, TrendingUp, Users, Award, Target, Sparkles, Leaf, Zap, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function InfoPage() {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Missão",
      description: "Conectar produtores, especialistas e empresas do agronegócio através de conteúdo de qualidade e inovação.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Visão",
      description: "Ser a principal plataforma de referência em conteúdo técnico e informativo do agronegócio brasileiro.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Valores",
      description: "Compromisso com a sustentabilidade, inovação, transparência e desenvolvimento do setor agrícola.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Leitores Mensais", icon: <Users className="h-6 w-6" /> },
    { number: "500+", label: "Artigos Publicados", icon: <Sparkles className="h-6 w-6" /> },
    { number: "50+", label: "Especialistas", icon: <Award className="h-6 w-6" /> },
    { number: "100+", label: "Empresas Parceiras", icon: <Heart className="h-6 w-6" /> },
  ];

  const galleryImages = [
    {
      src: "/images/agrovia-atual.jpg",
      alt: "Evento Agrovia",
      title: "Eventos e Workshops",
      description: "Conectando o campo com conhecimento",
    },
    {
      src: "/images/agrovia-conversa-bg.jpg",
      alt: "Tecnologia no campo",
      title: "Inovação Tecnológica",
      description: "Tecnologias que transformam o agronegócio",
    },
    {
      src: "/images/exploracao-agricola-verde.jpg",
      alt: "Sustentabilidade",
      title: "Sustentabilidade",
      description: "Práticas sustentáveis para o futuro",
    },
    {
      src: "/images/hero-bg.jpg",
      alt: "Produção Agrícola",
      title: "Produção Agrícola",
      description: "Impulsionando a produção nacional",
    },
    {
      src: "/images/pre-footer.jpg",
      alt: "Parcerias",
      title: "Parcerias Estratégicas",
      description: "Construindo o futuro do agro",
    },
    {
      src: "/images/agrovia-inspira1.jpg",
      alt: "Inspiração",
      title: "Histórias Inspiradoras",
      description: "Casos de sucesso do campo",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section Moderno */}
      <section className="relative w-full h-[550px] md:h-[650px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background com gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Efeitos decorativos animados */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl"></div>

        {/* Conteúdo */}
        <div className={`relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 transform transition-all duration-700 hover:scale-110">
            <Image
              src="/images/logo/logov-white.png"
              alt="Agrovia Logo"
              width={160}
              height={160}
              className="drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
            Sobre a Agrovia
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl leading-relaxed drop-shadow-lg font-light">
            A plataforma que conecta produtores, especialistas e empresas do agronegócio através de conteúdo de qualidade, inovação e conhecimento técnico.
          </p>
        </div>

        {/* Scroll indicator melhorado */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center p-6 md:p-8 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 hover:border-emerald-300 relative overflow-hidden"
              >
                {/* Efeito de fundo no hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Nossa Essência
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Missão, Visão e Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Os pilares que guiam nosso trabalho e compromisso com o agronegócio brasileiro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden`}
              >
                {/* Gradiente de fundo no hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Efeitos decorativos */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-5 ${feature.bgColor} rounded-2xl ${feature.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-5 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Texto Principal */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-10 shadow-sm">
              <Leaf className="h-4 w-4" />
              Nossa História
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-10 font-light tracking-tight">
              Confira alguns dos momentos mais marcantes da Agrovia em imagens que retratam nosso compromisso com o agronegócio, a inovação e a sustentabilidade no campo.
            </p>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mb-10"></div>
            </div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Acreditamos que o conhecimento compartilhado é a chave para o desenvolvimento sustentável do agronegócio. Por isso, trabalhamos diariamente para trazer conteúdo de qualidade, entrevistas com especialistas, análises técnicas e histórias inspiradoras que ajudam produtores e profissionais do setor a tomarem decisões mais informadas.
            </p>
          </div>
        </div>
      </section>

      {/* Galeria de Imagens Moderna */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Zap className="h-4 w-4" />
              Galeria
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Momentos Agrovia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Registros visuais do nosso trabalho e impacto no agronegócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div className="relative h-72 md:h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover transition-transform duration-700 ease-out ${
                      hoveredImage === index ? "scale-115" : "scale-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredImage === index ? "opacity-100" : "opacity-70"
                    }`}
                  />
                  
                  {/* Overlay com informações */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-6 lg:p-8 text-white transition-all duration-500 ${
                      hoveredImage === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                  >
                    <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                      <h3 className="text-xl lg:text-2xl font-bold mb-2 drop-shadow-lg">{image.title}</h3>
                      <p className="text-sm lg:text-base text-gray-200 drop-shadow-md">{image.description}</p>
                    </div>
                  </div>

                  {/* Badge sempre visível melhorado */}
                  <div className="absolute top-5 left-5">
                    <div className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-lg border border-white/20">
                      {index + 1} / {galleryImages.length}
                    </div>
                  </div>

                  {/* Indicador de hover */}
                  <div className={`absolute top-5 right-5 w-3 h-3 rounded-full bg-emerald-400 transition-all duration-300 ${
                    hoveredImage === index ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 overflow-hidden">
        {/* Efeitos decorativos de fundo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-lg hover:scale-110 transition-transform duration-300">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Faça Parte da Comunidade Agrovia
          </h2>
          <p className="text-xl md:text-2xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Junte-se a milhares de produtores, especialistas e empresas que já fazem parte da nossa comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <button
              onClick={() => router.push("/contact")}
              className="group px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Entre em Contato
              <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-transparent border-2 border-white/80 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Explorar Conteúdo
            </button>
          </div>
        </div>
      </section>

      {/* Botão Voltar */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-emerald-600"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-2" />
            Voltar
          </button>
        </div>
      </section>
    </main>
  );
}
