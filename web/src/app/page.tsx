import About from "@/components/About";
import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import Clients from "@/components/Clients";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import AgroviaEnsina from "@/components/AgroviaEnsina";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";
import AgroviaLegal from "@/components/AgroviaLegal";

export const metadata: Metadata = {
  title: "A Agrovia é a plataforma que conecta produtores, especialistas e empresas do agronegócio. Notícias, artigos, entrevistas e conteúdos exclusivos para impulsionar o futuro do setor agro no Brasil.",
  description: "",
};

export default function Home() {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <ScrollUp />
      <Hero />
      <About />
      <AgroviaEnsina />
      <AgroviaLegal />      
      {/* <CallToAction />
      <Pricing />
      <Testimonials />
      <Faq />
      <Team />
      <HomeBlogSection posts={posts} />
      <Contact />
      <Clients /> */}
    </main>
  );
}
