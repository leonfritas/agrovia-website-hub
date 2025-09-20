import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Agrovia - O ponto de encontro do agro",
  description:
    "Entre em contato com a Agrovia. Tire suas dúvidas, envie sugestões e saiba mais sobre como participar da comunidade que conecta o agronegócio no Brasil.",
};


const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact Page" />

      <Contact />
    </>
  );
};

export default ContactPage;
