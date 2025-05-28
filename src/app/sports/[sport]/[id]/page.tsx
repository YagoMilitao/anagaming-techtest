
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa'; // Ícones
import { OddDetailPageState } from '@/state/OddDetailPageState'; // Importe a classe de estado
import { OddDetailPageViewModel } from '@/app/viewmodels/OddDetailPageViewModel';
import OddsSkeleton from '@/app/components/OddsSkeleton';
 

export default function OddDetailPage() {
  const params = useParams();
  const sportKey = params?.sport as string; 
  const oddId = params?.id as string; 
  const isLoading :boolean = false

  
  const [state] = useState(() => new OddDetailPageState(sportKey, oddId));

  
  useEffect(() => {
    state.loadOddDetails();
  }, [state, sportKey, oddId]);

  
  const viewModel = new OddDetailPageViewModel(state);
  const displayData = viewModel.getDisplayData(); 

  if (displayData.isLoading ) {
    return <OddsSkeleton />;
  }

  // if (displayData.isLoading) {
  //   return <div className="p-6 text-center text-xl">Carregando detalhes da odd...</div>;
  // }

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
            <h3 className="text-lg font-medium mb-2">{bookmaker.title}</h3> 
            {bookmaker.markets.map((market, index) => (
              <div key={market.key || index} className="flex flex-wrap gap-4 mt-2"> 
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
