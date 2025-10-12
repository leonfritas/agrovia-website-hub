import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <section
      id="about"
      className="bg-white pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="flex flex-wrap items-center -mx-4">
          {/* Texto */}
          <div className="w-full px-4 lg:w-1/2">
            <span className="inline-block rounded-md bg-green-900 px-4 py-1 text-sm font-medium text-white mb-4">
              Sobre nós
            </span>

            <h2 className="mb-2 text-3xl font-bold leading-tight text-dark sm:text-[40px] sm:leading-[1.2]">
              O Que É a Agrovia?
            </h2>
            <h3 className="mb-6 text-xl font-semibold text-green-900">
              O Ponto de Encontro do Agro
            </h3>

            <p className="mb-6 text-base leading-relaxed text-gray-700">
              Agrovia é um hub digital completo e intuitivo para o agronegócio.
              Um ambiente desenhado para o produtor rural encontrar tudo o que
              precisa para produzir com mais segurança, visão e apoio 4 em um só
              lugar.
            </p>

            <p className="mb-10 text-base leading-relaxed text-gray-700">
              Oferecemos informação confiável, orientação técnica e jurídica,
              inspiração, produtos e serviços, tudo com uma linguagem acessível,
              moderna e alinhada com a realidade do campo.
            </p>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div>
                <h4 className="text-3xl font-extrabold text-dark">5M+</h4>
                <p className="text-green-900 font-medium">Produtores Rurais</p>
                <p className="text-sm text-gray-600">
                  No Brasil, com mais de 75% utilizando WhatsApp ou redes sociais
                  como fonte de informação.
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-dark">75%</h4>
                <p className="text-green-900 font-medium">
                  Insegurança Legal/Tecnológica
                </p>
                <p className="text-sm text-gray-600">
                  A maioria se sente insegura diante de temas jurídicos,
                  ambientais e tecnológicos.
                </p>
              </div>
            </div>

            <Link
              href="/sobre"
              className="inline-flex items-center justify-center rounded-md bg-dark px-6 py-3 text-base font-medium text-white duration-300 hover:bg-green-900"
            >
              Veja mais
            </Link>
          </div>

          {/* Imagem / Logo */}
          <div className="w-full px-4 mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
            <Image
              src="/images/logo/logov.png" // substitua pelo caminho correto da sua logo
              alt="Agrovia Logo"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
