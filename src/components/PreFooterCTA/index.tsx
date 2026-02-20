import Image from "next/image";
import Link from "next/link";

export default function PreFooterCTA() {
  return (
    <section className="bg-emerald-900">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="relative h-[360px] md:h-[820px] overflow-hidden rounded-2xl">
          {/* BG */}
          <Image
            src="/images/pre-footer.jpg" // troque pela sua imagem
            alt="Produtor no campo"
            fill
            priority={false}
            className="object-cover"
          />
          {/* Scrim p/ legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

          {/* Conteúdo */}
          <div className="relative z-10 h-full flex flex-col justify-center gap-3 md:gap-4 px-6 md:px-10 max-w-3xl text-white">
            <div className="w-40 md:w-80">
              <Image
                src="/images/logo/logo-white-simples.png" // logo branco
                alt="Agrovia"
                width={400}
                height={200}
                className="h-auto w-full object-contain"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="text-sm md:text-base text-white/90">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis.
            </p>
            <div className="pt-2">
              <Link
                href="https://wa.me/5592988538416?text=Ol%C3%A1!%20Gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-emerald-900 font-medium shadow-sm hover:opacity-90"
              >
                Contacte-nos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
