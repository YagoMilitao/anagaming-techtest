// src/features/odds/components/OddsListItem.tsx
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Ícone da seta para o link "Ver Detalhes"

// Assumindo que esses são os caminhos corretos para seus tipos e utilitários
import { Odd } from "@/data/Odd";
import { getBestTeamOdds } from "@/utils/oddsCalculation";
import { formatDate } from "@/utils/formatDate";
import { getSportName } from "@/utils/sportNameDictionary";
import { getSportIcon } from "@/utils/sportIconDictionary";

interface OddsListItemProps {
  odd: Odd;
  onSelectOdd: (oddId: string, sportKey: string) => void;
}

const OddsListItem: React.FC<OddsListItemProps> = ({ odd, onSelectOdd }) => {
  // Desestruturando as melhores odds e informações dos bookmakers
  const {
    bestPriceHome,
    bestOutcomeHome,
    bestBookmakerHome,
    bestPriceAway,
    bestOutcomeAway,
    bestBookmakerAway,
    bestPriceDraw,
    bestBookmakerDraw,
  } = getBestTeamOdds(odd.bookmakers, odd);

  // Formatando o tempo da partida
  const formattedTime = formatDate(odd.commence_time);

  // Handler para o clique no card inteiro
  const handleItemClick = () => {
    onSelectOdd(odd.id, odd.sport_key);
  };

  // Lógica para determinar as classes de cor das odds
  let homePriceClass = "text-green-600"; // Cor padrão verde para a maior
  let awayPriceClass = "text-green-600"; // Cor padrão verde para a maior

  if (bestPriceHome !== null && bestPriceAway !== null) {
    if (bestPriceHome > bestPriceAway) {
      homePriceClass = "text-green-600";
      awayPriceClass = "text-gray-500"; // Menor odd em cinza
    } else if (bestPriceAway > bestPriceHome) {
      homePriceClass = "text-gray-500"; // Menor odd em cinza
      awayPriceClass = "text-green-600";
    } else {
      // Se forem iguais, ambos verdes
      homePriceClass = "text-green-600";
      awayPriceClass = "text-green-600";
    }
  }

  const SportIcon = getSportIcon(odd.sport_key);
  return (
    <div
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-500 group flex flex-col h-full"
      onClick={handleItemClick}
    >
      {/* Seção do Cabeçalho: Esporte, Liga e Horário */}
      <div className="flex justify-between items-start mb-3">
        {/* Esporte e Liga agrupados verticalmente */}
        <div className="flex flex-col pr-2">
          <span className="text-sm text-gray-500 font-medium leading-tight flex items-center">
            {SportIcon && <SportIcon className="mr-1" size={16} />}
            {getSportName(odd.sport_key)}
          </span>
          {odd.league_name && <span className="text-xs text-gray-400 italic leading-tight">{odd.league_name}</span>}
        </div>
        {/* Horário da partida */}
        <span className="text-sm text-gray-500 flex-shrink-0">{formattedTime}</span>
      </div>

      {/* Seção dos Times da Partida */}
      <div className="mb-4">
        <h3 className="font-semibold text-2xl text-gray-900 leading-tight">
          {odd.home_team} <span className="text-gray-400 font-normal">vs</span> {odd.away_team}
        </h3>
      </div>

      {/* SEÇÃO DAS ODDS - AJUSTADO PARA CORES CONDICIONAIS */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 mb-5 flex-grow">
        {/* Bloco da Odd para o Time da Casa */}
        {bestPriceHome !== null && (
          <div className="flex flex-col p-3 rounded-md bg-blue-50">
            {/* Linha: Nome do Time (Esquerda) e Odd (Direita) */}
            <div className="flex justify-between items-start w-full mb-1">
              <span className="font-medium text-blue-700 text-base pr-2 break-words">
                {bestOutcomeHome || odd.home_team}
              </span>
              {/* Aplicando a classe de cor condicionalmente */}
              <span className={`text-xl font-bold flex-shrink-0 ${homePriceClass}`}>{bestPriceHome.toFixed(2)}</span>
            </div>
            {/* Linha: Nome da Casa de Apostas (Direita) */}
            {bestBookmakerHome && (
              <span className="text-xs italic text-blue-600 text-right mt-auto">{bestBookmakerHome}</span>
            )}
          </div>
        )}

        {/* Bloco da Odd para o Time Visitante */}
        {bestPriceAway !== null && (
          <div className="flex flex-col p-3 rounded-md bg-blue-50">
            <div className="flex justify-between items-start w-full mb-1">
              <span className="font-medium text-blue-700 text-base pr-2 break-words">
                {bestOutcomeAway || odd.away_team}
              </span>
              {/* Aplicando a classe de cor condicionalmente */}
              <span className={`text-xl font-bold flex-shrink-0 ${awayPriceClass}`}>{bestPriceAway.toFixed(2)}</span>
            </div>
            {bestBookmakerAway && (
              <span className="text-xs italic text-blue-600 text-right mt-auto">{bestBookmakerAway}</span>
            )}
          </div>
        )}

        {/* Bloco da Odd para Empate (se aplicável) */}
        {bestPriceDraw !== null && (
          <div className="flex flex-col p-3 rounded-md bg-blue-50 col-span-full">
            <div className="flex justify-between items-start w-full mb-1">
              <span className="font-medium text-blue-700 text-base pr-2 break-words">Empate</span>
              {/* Empate sempre verde, pois não é comparado */}
              <span className="text-xl font-bold text-green-600 flex-shrink-0">{bestPriceDraw.toFixed(2)}</span>
            </div>
            {bestBookmakerDraw && (
              <span className="text-xs italic text-blue-600 text-right mt-auto">{bestBookmakerDraw}</span>
            )}
          </div>
        )}
      </div>

      {/* Seção do Link "Ver Detalhes" */}
      <div className="mt-auto text-right pt-4 border-t border-gray-100">
        <Link
          href={`/sports/${odd.sport_key}/${odd.id}`}
          passHref
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          Ver Detalhes
          <ArrowRight className="ml-1" size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OddsListItem;
