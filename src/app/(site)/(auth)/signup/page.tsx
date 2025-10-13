// Temporarily disable signup page
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Agrovia - Temporarily Disabled",
};

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Cadastro Temporariamente Desabilitado
        </h1>
        <p className="text-gray-600 mb-8">
          Esta funcionalidade está sendo configurada. Tente novamente mais tarde.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-[#7B5B33] text-white rounded-md hover:bg-[#6B4B2B] transition-colors"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default SignupPage;
