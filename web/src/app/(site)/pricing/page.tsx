import Breadcrumb from "@/components/Common/Breadcrumb";
import Faq from "@/components/ParceriasInstitucionais";
import Pricing from "@/components/AgroviaAtual";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos e Preços | Agrovia - O ponto de encontro do agro",
  description:
    "Conheça os planos e preços da Agrovia. Escolha a melhor opção para acessar conteúdos exclusivos, fortalecer sua presença no agronegócio e fazer parte da nossa comunidade.",
};


const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing Page" />
      <Pricing />
      <Faq />
    </>
  );
};

export default PricingPage;
