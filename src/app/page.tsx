import ScrollUp from "@/components/Common/ScrollUp";
import Footer from "@/components/Footer";
import PortalHomepage from "@/components/NewsPortal/PortalHomepage";
import AgroviaAtual from "@/components/AgroviaAtual";
import AgroviaEnsina from "@/components/AgroviaEnsina";
import AgroviaLegal from "@/components/AgroviaLegal";
import AgroviaInspira from "@/components/AgroviaInspira";
import AgroviaConversa from "@/components/AgroviaConversa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agrovia - Portal de Notícias do Agronegócio | Notícias, Artigos e Entrevistas",
  description: "Portal de notícias do agronegócio brasileiro. Fique por dentro das últimas notícias, tendências, entrevistas e análises do setor agrícola.",
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      {/* Portal de Notícias - Layout Principal com todas as categorias */}
      <PortalHomepage />
      
      {/* Seções completas das categorias (para scroll/anchor links) */}
      <div id="agrovia-atual">
        <AgroviaAtual />
      </div>
      <AgroviaEnsina />
      <AgroviaLegal />
      
      {/* Seções de Vídeos */}
      <AgroviaConversa />
      <AgroviaInspira />
      
      <Footer />
    </main>
  );
}
