// src/app/sports/[sport]/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa'; // Ícones

import { OddDetailPageState } from '@/state/OddDetailPageState'; // Importe a classe de estado
import { OddDetailPageViewModel } from '@/app/viewmodels/OddDetailPageViewModel';
 // Importe a classe ViewModel

export default function OddDetailPage() {
  const params = useParams();
  const sportKey = params?.sport as string; // 'sport' do seu path dinâmico
  const oddId = params?.id as string; // 'id' do seu path dinâmico

  // 1. Crie uma única instância da classe de estado
  // A instância é criada apenas uma vez quando o componente é montado.
  const [state] = useState(() => new OddDetailPageState(sportKey, oddId));

  // 2. Carrega os detalhes da odd quando o componente monta ou quando sportKey/oddId mudam
  // A dependência em 'state' garante que o efeito seja executado quando a instância do estado estiver pronta.
  // As dependências 'sportKey' e 'oddId' garantem que a busca seja re-executada se a URL mudar.
  useEffect(() => {
    state.loadOddDetails();
  }, [state, sportKey, oddId]); // Adicione sportKey e oddId como dependências

  // 3. Crie o ViewModel a partir do estado.
  // O ViewModel é recriado a cada renderização do componente.
  // Isso garante que os dados exibidos na UI (via ViewModel) sempre reflitam
  // o estado mais recente da classe OddDetailPageState.
  const viewModel = new OddDetailPageViewModel(state);
  const displayData = viewModel.getDisplayData(); // Obtenha os dados prontos para exibição

  // 4. Lógica de renderização baseada no estado do ViewModel
  if (displayData.isLoading) {
    return <div className="p-6 text-center text-xl">Carregando detalhes da odd...</div>;
  }

  if (displayData.hasError) {
    return (
      <div className="p-6 text-center text-red-600 text-xl">
        Erro: {displayData.errorMessage || "Ocorreu um erro ao carregar os detalhes da odd."}
        <button 
          onClick={() => state.loadOddDetails()} 
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!displayData.oddFound) {
    return <div className="p-6 text-center text-gray-700 text-xl">Odd não encontrada.</div>;
  }

  // 5. Renderiza a UI usando os dados do ViewModel
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{displayData.homeTeam} vs {displayData.awayTeam}</h1>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaTrophy className="mr-2" />
          <span>{displayData.leagueName}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>{displayData.formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2" />
          <span>{displayData.formattedTime}</span>
        </div>

        <h2 className="text-xl font-semibold mb-2">Odds</h2>
        {displayData.bookmakers.map((bookmaker) => (
          <div key={bookmaker.key} className="mb-4 border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">{bookmaker.title}</h3> {/* Usar bookmaker.title */}
            {bookmaker.markets.map((market, index) => (
              <div key={market.key || index} className="flex flex-wrap gap-4 mt-2"> {/* Usar market.key ou index */}
                <span className="font-semibold text-gray-700">{market.key.toUpperCase()}:</span>
                {market.outcomes.map((outcome, idx) => (
                  <div key={outcome.name || idx} className="bg-gray-100 p-2 rounded-md border border-gray-200">
                    <span className="block font-medium text-gray-800">{outcome.name}</span>
                    <span className="text-blue-600 font-bold">
                      {typeof outcome.price === 'number'
                        ? outcome.price.toFixed(2)
                        : outcome.price}
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
