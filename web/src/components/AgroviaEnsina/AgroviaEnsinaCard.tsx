import { AgroviaEnsina } from "@/types/agrovia-ensina";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AgroviaEnsinaCardProps {
  agroviaensina: AgroviaEnsina;
}

const AgroviaEnsinaCard = ({ agroviaensina }: AgroviaEnsinaCardProps) => {
  return (
    <div className="rounded-2xl bg-[#7B5B33] p-6 text-white flex flex-col justify-between shadow-md transition hover:shadow-lg">
      {/* Ícone + Título */}
      <div className="mb-4 flex items-center gap-3">
        <Image src={agroviaensina.icon} alt={agroviaensina.title} width={40} height={40} />
        <h3 className="text-lg font-semibold">{agroviaensina.id}{agroviaensina.title}</h3>
      </div>

      {/* Subtítulo/descrição */}
      <p className="mb-4 text-sm leading-relaxed">{agroviaensina.subtitle}</p>

      {/* Link com seta */}
      <div className="mt-auto flex justify-end">
        <Link href={agroviaensina.link}>
          <ArrowRight className="w-6 h-6 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default AgroviaEnsinaCard;
