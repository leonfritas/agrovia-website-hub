import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-[100dvh] w-full bg-cover bg-center bg-no-repeat
                bg-[url('/images/hero-responsive-bg.jpg')] sm:bg-[url('/images/hero-bg.jpg')]"
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full items-center justify-start text-center px-4 sm:w-2/3 sm:mx-36">
        <div className="w-full">
          <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-5xl lg:text-6xl w-full text-left">
            A união que fortalece o campo e impulsiona o futuro do agronegócio.
          </h1>

          <div className="mt-6 flex justify-start">
            <Link
              href="https://wa.me/5592991554925?text=Ol%C3%A1!%20Gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
              className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-green-900 shadow-lg hover:bg-green-100 transition my-5"
            >
              Contacte - nos
            </Link>
          </div>
        </div>
      </div>
    </section>


  );
};

export default Hero;
