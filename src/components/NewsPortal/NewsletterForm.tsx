"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const getApiBaseUrl = () => {
  let baseUrl = "";
  if (process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      baseUrl = baseUrl.replace("https://", "http://");
    }
  } else {
    if (typeof window !== "undefined") {
      baseUrl = "http://localhost:4000";
    } else {
      baseUrl = "http://localhost:4000";
    }
  }
  return baseUrl.replace(/\/api$/, "");
};

const API_BASE_URL = getApiBaseUrl();

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("Por favor, informe seu e-mail");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Erro ao cadastrar e-mail. Tente novamente.");
        return;
      }

      setStatus("success");
      setMessage("E-mail cadastrado com sucesso! Obrigado.");
      setEmail("");

      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Erro ao cadastrar email:", error);
      setStatus("error");
      setMessage("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  return (
    <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-md">
      <TrendingUp className="mb-3 h-8 w-8" />
      <h3 className="mb-2 text-lg font-bold">Fique por dentro</h3>
      <p className="mb-4 text-sm opacity-90">
        Receba as principais notícias do agronegócio diretamente no seu e-mail.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            disabled={status === "loading"}
            className="w-full rounded-md border-0 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {status === "loading"
            ? "Cadastrando..."
            : status === "success"
            ? "Cadastrado!"
            : "Inscrever-se"}
        </button>
      </form>

      {/* Mensagem de feedback */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm flex items-start gap-2 ${
            status === "success"
              ? "bg-green-500/20 text-green-100 border border-green-400/30"
              : "bg-red-500/20 text-red-100 border border-red-400/30"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}


