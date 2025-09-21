import About from "@/components/About";
import PreFooterCTA from "@/components/PreFooterCTA";
import AgroviaInspira from "@/components/AgroviaInspira";
import ScrollUp from "@/components/Common/ScrollUp";
import Footer from "@/components/Footer";
import ParceriasInstitucionais from "@/components/ParceriasInstitucionais";
import AgroviaEnsina from "@/components/AgroviaEnsina";
import Hero from "@/components/Hero";
import AgroviaAtual from "@/components/AgroviaAtual";
import GuiaAgrovia from "@/components/GuiaAgrovia";
import AgroviaConversa from "@/components/AgroviaConversa";
import { Metadata } from "next";
import AgroviaLegal from "@/components/AgroviaLegal";

export const metadata: Metadata = {
  title: "A Agrovia é a plataforma que conecta produtores, especialistas e empresas do agronegócio. Notícias, artigos, entrevistas e conteúdos exclusivos para impulsionar o futuro do setor agro no Brasil.",
  description: "",
};

export default function Home() {

  return (
    <main>
      <ScrollUp />
      <Hero />
      <About />
      <AgroviaEnsina />
      <AgroviaLegal />      
      <AgroviaInspira />
      <AgroviaAtual />
      <AgroviaConversa />
      <ParceriasInstitucionais />
      <GuiaAgrovia />
      <PreFooterCTA />
      {/* <Footer /> */}
    </main>
  );
}
