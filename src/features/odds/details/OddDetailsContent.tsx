"use client";

import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { Odd } from "@/data/Odd";
import { formatDate } from "@/utils/formatDate";
import { getSportIcon } from "@/utils/sportIconDictionary";
import { getSportName } from "@/utils/sportNameDictionary";

interface OddDetailsContentProps {
  odd: Odd | null;
  error?: string | null;
}

export default function OddDetailsContent({ odd, error }: OddDetailsContentProps) {
  if (error) {
    let errorMessage: string;
    switch (error) {
      case "QUOTA_EXCEEDED":
        errorMessage =
          "Cota da API excedida. Não foi possível carregar os detalhes desta partida. Tente novamente mais tarde.";
        break;
      case "API_KEY_MISSING":
        errorMessage = "Erro interno: A chave da API de odds não está configurada corretamente.";
        break;
      case "INVALID_DATA_FORMAT":
        errorMessage = "Erro ao processar os dados dos detalhes da partida.";
        break;
      case "EVENT_NOT_FOUND":
        errorMessage =
          "A partida que você tentou acessar não foi encontrada ou já expirou. Por favor, volte para a lista de jogos.";
        break;
      case "API_ERROR":
        errorMessage = "Erro da API ao carregar detalhes da partida. Tente novamente.";
        break;
      case "NETWORK_ERROR":
        errorMessage = "Erro de rede ao buscar detalhes da partida. Verifique sua conexão.";
        break;
      case "UNKNOWN_ERROR":
      default:
        errorMessage = "Ocorreu um erro ao carregar os detalhes desta partida. Por favor, tente novamente.";
        break;
    }
    return <div className="p-6 text-center text-gray-700 text-xl">{errorMessage}</div>;
  }

  if (!odd) {
    return <div className="p-6 text-center text-gray-700 text-xl">Odd não encontrada.</div>;
  }

  if (
    typeof odd.home_team !== "string" ||
    typeof odd.away_team !== "string" ||
    typeof odd.commence_time !== "string" ||
    !Array.isArray(odd.bookmakers)
  ) {
    console.error("OddDetailsContent: Dados da odd incompletos ou inválidos.", odd);
    return (
      <div className="p-6 text-center text-red-600 text-xl">
        Erro: Dados da odd incompletos ou inválidos para exibição.
      </div>
    );
  }

  const commenceDate = new Date(odd.commence_time);
  const formattedDate = isNaN(commenceDate.getTime()) ? "Data Inválida" : formatDate(odd.commence_time);
  const formattedTime = isNaN(commenceDate.getTime()) ? "Hora Inválida" : formatDate(odd.commence_time);
  const SportIcon = getSportIcon(odd.sport_key);
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">
          {odd.home_team} vs {odd.away_team}
        </h1>

        <div className="flex items-center text-gray-600 mb-2">
          {SportIcon && <SportIcon className="mr-2" />}
          {getSportName(odd.sport_key)}
          <span>{odd.league_name || odd.sport_title || "N/A"}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2" />
          <span>{formattedTime}</span>
        </div>

        <h2 className="text-xl font-semibold mb-2">Odds</h2>
        {odd.bookmakers.map((bookmaker) => (
          <div key={bookmaker.key} className="mb-4 border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">{bookmaker.title}</h3>
            {bookmaker.markets?.map((market, index) => (
              <div key={market.key || index} className="flex flex-wrap gap-4 mt-2">
                {market.outcomes?.map((outcome, idx) => (
                  <div key={outcome.name || idx} className="bg-gray-100 p-2 rounded-md border border-gray-200">
                    <span className="block font-medium text-gray-800">{outcome.name || "Nome Desconhecido"}</span>
                    <span className="text-blue-600 font-bold">
                      {typeof outcome.price === "number"
                        ? outcome.price.toFixed(2)
                        : (parseFloat(String(outcome.price)) || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
