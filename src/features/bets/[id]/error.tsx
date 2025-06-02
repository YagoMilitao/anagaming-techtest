"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function OddDetailsError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Error in Odd Details Page:", error);
  }, [error]);

  return (
    <div className="p-6 max-w-xl mx-auto text-center bg-red-50 border border-red-200 rounded-lg shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-red-700 mb-3">Ops! Algo deu errado ao carregar a odd.</h2>
      <p className="text-red-600 mb-4">
        {error.message || "Houve um problema inesperado. Por favor, tente novamente."}
      </p>
      <button
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={
          () => reset()
        }
      >
        Tentar Novamente
      </button>
    </div>
  );
}
