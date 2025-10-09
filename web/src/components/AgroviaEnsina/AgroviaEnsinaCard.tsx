import { AgroviaEnsina } from "@/types/agrovia-ensina";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AgroviaEnsinaCardProps {
  agroviaensina: AgroviaEnsina;
}

const AgroviaEnsinaCard = ({ agroviaensina }: AgroviaEnsinaCardProps) => {
  return (
    <div className="rounded-3xl bg-[#7B5B33] p-6 text-white flex flex-col justify-between shadow-md transition hover:shadow-lg w-100 h-100">
      {/* Ícone + Título */}
      <div className="mb-4 flex items-center gap-3">
        <Image src={agroviaensina.icon} alt={agroviaensina.title} width={60} height={60} />
        <h3 className="text-lg font-semibold">{agroviaensina.title}</h3>
      </div>

      {/* Subtítulo/descrição */}
      <p className="mb-4 text-sm leading-relaxed">{agroviaensina.subtitle}</p>

      {/* Link com seta */}
      <div className="mt-auto flex justify-end">
        <a 
          href={agroviaensina.link}
          onClick={(e) => {
            e.preventDefault();
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
            window.location.href = agroviaensina.link;
          }}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white cursor-pointer hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 text-[#7B5B33]" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default AgroviaEnsinaCard;
