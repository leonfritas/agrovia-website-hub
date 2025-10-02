
import AgroviaEnsinaData from "./agroviaEnsinaData";
import AgroviaEnsinaCard from "./AgroviaEnsinaCard";

const AgroviaEnsina = () => {
  

  return (
    <section id="agrovia-ensina" className="pb-10 pt-10 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        {/* Badge */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm font-medium text-white mb-10 lg:mb-24">
          Agrovia Ensina
        </span>

        {/* Título */}
        <h2 className="mb-12 lg:mb-24 max-w-3xl text-2xl font-bold leading-snug text-dark sm:text-3xl lg:text-4xl">
          Técnicas que aumentam sua produtividade com o pé no chão. <br />
          <span className="block">
            Conteúdos técnicos e aplicáveis com linguagem descomplicada.
          </span>
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">                    
          {AgroviaEnsinaData.map((agroviaensina, i) => (
            <AgroviaEnsinaCard key={i} agroviaensina={agroviaensina} />
          ))}                    
        </div>
      </div>
    </section>
  );
};

export default AgroviaEnsina;
