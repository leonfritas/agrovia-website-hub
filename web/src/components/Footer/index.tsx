import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="container mx-auto px-4 pt-10 pb-6">
        <div className="grid gap-10 md:grid-cols-3">
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

          {/* Coluna 2: Links */}
          <div>
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

          {/* Coluna 3: Contatos */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">
              Contactos
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>Rua Exemplo, 123 — Cidade/UF</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4" />
                <span>contato@agrovia.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 border-t border-white/10 pt-4 text-xs text-white/80 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Agrovia. Todos os direitos reservados.</p>
          <p>
            Design feito por:{" "}
            <Link href="https://moa.example" className="underline hover:no-underline">
              MOA
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
