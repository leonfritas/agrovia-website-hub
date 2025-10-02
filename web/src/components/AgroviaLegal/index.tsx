
import AgroviaLegalData from "./agroviaLegalData";
import AgroviaEnsinaCard from "../AgroviaEnsina/AgroviaEnsinaCard";

const AgroviaLegal = () => {
  

  return (
    <section id="agrovia-legal" className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        {/* Badge */}
        <span className="inline-block rounded-md bg-[#7B5B33] px-4 py-1 text-sm font-medium text-white mb-10 lg:mb-24">
          Agrovia Legal
        </span>

        {/* Título */}
        <h2 className="mb-10 lg:mb-24 max-w-3xl text-2xl font-bold leading-snug text-dark sm:text-3xl lg:text-4xl">
          
          Seu direito no campo, explicado de forma clara.

          <br />
          <span className="block">
            Dúvidasjurídicas traduzidas por quem entende do agro
          </span>
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">                    
          {AgroviaLegalData.map((agroviaensina, i) => (
            <AgroviaEnsinaCard key={i} agroviaensina={agroviaensina} />
          ))}                    
        </div>
      </div>
    </section>
  );
};

export default AgroviaLegal;
