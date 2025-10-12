import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white">
      {/* Conteúdo centralizado e com pouco padding lateral */}
      <div className="mx-auto w-full max-w-none px-2 sm:px-[150px] pt-10 pb-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-around items-center flex-wrap">
          {/* Coluna 1: Marca */}
          <div>
            <div className="w-44">
              <Image
                src="/images/logo/logo-white.png"
                alt="Agrovia"
                width={200}
                height={70}
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/85">
              O ponto de encontro do agro. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>

            {/* Social */}
            <div className="mt-4 flex items-center gap-3">
              <Link href="https://instagram.com" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="https://youtube.com" aria-label="YouTube" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
  {/* Links */}
  <div className="mx-auto w-full max-w-xs text-center md:mx-0 md:max-w-none md:text-left">
    <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">
      Links de acesso
    </h4>
    <ul className="mt-4 space-y-2 text-sm text-white/90">
      <li><Link href="/" className="hover:underline">Home</Link></li>
      <li><Link href="/sobre" className="hover:underline">Sobre nós</Link></li>
      <li><Link href="/servicos" className="hover:underline">Serviços</Link></li>
      <li><Link href="/projetos" className="hover:underline">Projetos</Link></li>
    </ul>
  </div>

  {/* Contactos */}
  <div className="mx-auto w-full max-w-xs text-center md:mx-0 md:max-w-none md:text-left">
    <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">
      Contatos
    </h4>

    {/* No mobile: grade (ícone | texto). No desktop: volta a ser flex */}
    <ul className="mt-4 space-y-3 text-sm text-white/90">
      <li className="grid grid-cols-[1.25rem,1fr] items-start gap-3 md:flex md:items-start md:gap-2">
        <MapPin className="mx-auto md:mx-0 mt-0.5 h-4 w-4" />
        <span>Rua Exemplo, 123 — Cidade/UF</span>
      </li>
      <li className="grid grid-cols-[1.25rem,1fr] items-start gap-3 md:flex md:items-start md:gap-2">
        <Phone className="mx-auto md:mx-0 mt-0.5 h-4 w-4" />
        <span>(00) 0000-0000</span>
      </li>
      <li className="grid grid-cols-[1.25rem,1fr] items-start gap-3 md:flex md:items-start md:gap-2">
        <Mail className="mx-auto md:mx-0 mt-0.5 h-4 w-4" />
        <span>contato@agrovia.com</span>
      </li>
    </ul>
  </div>
</div>

          
        </div>

        {/* Barra inferior */}
        <div className="mt-10 border-t border-white/10 pt-4 text-xs text-white/80 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Agrovia. Todos os direitos reservados.</p>
          <p>
            Design feito por:{" "}
            <Link href="https://moa.example" className="underline hover:no-underline">
              <Image src={"/images/logo/logo-maloca.png"} alt="MoA" width={40} height={10} className="inline h-auto w-10 object-contain" />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
