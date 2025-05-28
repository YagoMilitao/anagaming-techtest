// src/app/sports/[sport]/[id]/page.tsx
// Este é agora um Server Component

import { FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';
import { fetchOddById } from '@/app/lib/fetchOdds'; // Importe a função de busca
import { OddData } from '@/data/Odd'; // Importe a interface OddData
import { notFound } from 'next/navigation'; // Para lidar com odds não encontradas

// Esta função agora é um Server Component assíncrono
export default async function OddDetailPage({ params }: { params: { sport: string; id: string } }) {
  const { sport, id } = params; // Obtém sport e id dos parâmetros da URL

  // Busca os detalhes da odd diretamente no servidor
  const odd: OddData | null = await fetchOddById(sport, id);

  // Tratamento de erro: Se a odd não for encontrada, exibe a página 404 do Next.js
  if (!odd) {
    notFound(); // Redireciona para a página not-found.tsx se ela existir
    // Ou você pode renderizar uma mensagem de "Odd não encontrada" diretamente:
    // return <div className="p-6 text-center text-gray-700 text-xl">Odd não encontrada.</div>;
  }

  // Tratamento de erro: Valida as propriedades essenciais da odd antes de renderizar
  if (typeof odd.home_team !== 'string' || typeof odd.away_team !== 'string' ||
      typeof odd.commence_time !== 'string' || !Array.isArray(odd.bookmakers)) {
    console.error("OddDetailPage: Dados da odd incompletos ou inválidos para exibição.", odd);
    return (
      <div className="p-6 text-center text-red-600 text-xl">
        Erro: Dados da odd incompletos ou inválidos para exibição.
      </div>
    );
  }

  // Formatação de datas (pode ser movida para uma função utilitária se usada em vários lugares)
  const commenceDate = new Date(odd.commence_time);
  const formattedDate = isNaN(commenceDate.getTime()) ? 'Data Inválida' : commenceDate.toLocaleDateString();
  const formattedTime = isNaN(commenceDate.getTime()) ? 'Hora Inválida' : commenceDate.toLocaleTimeString();

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{odd.home_team} vs {odd.away_team}</h1>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaTrophy className="mr-2" />
          <span>{odd.league_name || odd.sport_title || 'N/A'}</span> {/* Prioriza league_name */}
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
            {Array.isArray(bookmaker.markets) && bookmaker.markets.map((market, index) => ( // Validação de array
              <div key={market.key || index} className="flex flex-wrap gap-4 mt-2"> 
                <span className="font-semibold text-gray-700">{market.key?.toUpperCase() || 'Mercado Desconhecido'}:</span> {/* Validação de market.key */}
                {Array.isArray(market.outcomes) && market.outcomes.map((outcome, idx) => ( // Validação de array
                  <div key={outcome.name || idx} className="bg-gray-100 p-2 rounded-md border border-gray-200">
                    <span className="block font-medium text-gray-800">{outcome.name || 'Nome Desconhecido'}</span> {/* Validação de outcome.name */}
                    <span className="text-blue-600 font-bold">{
                      typeof outcome.price === 'number' 
                        ? outcome.price.toFixed(2) 
                        : (parseFloat(String(outcome.price)) || 0).toFixed(2) // Garante que é número e formata
                    }</span>
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
