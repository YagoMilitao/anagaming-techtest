import { fetchOddsById } from '@/app/lib/fetchOdds';
import Link from 'next/link';

export default async function ApostaDetalhe({ params }: { params: { id: string } }) {
  const game = await fetchOddsById(params.id);

  if (!game) return <p className="p-6">Aposta não encontrada.</p>;

  return (
    <main className="p-6">
      <Link href="/" className="text-blue-500 underline">← Voltar</Link>

      <h1 className="text-2xl font-bold my-4">{game.sport_title}</h1>
      <p className="text-lg mb-2">{game.teams.join(' vs ')}</p>
      <p className="text-gray-600 mb-4">
        Data: {new Date(game.commence_time).toLocaleString()}
      </p>

      <div className="space-y-4">
        {game.bookmakers?.map((bookmaker: any) => (
          <div key={bookmaker.key} className="border rounded p-4">
            <h2 className="font-semibold text-lg">{bookmaker.title}</h2>
            <ul className="mt-2 space-y-1">
              {bookmaker.markets?.map((market: any) => (
                <li key={market.key}>
                  <strong>{market.key.toUpperCase()}</strong>:
                  {market.outcomes?.map((o: any) => (
                    <div key={o.name} className="ml-4">
                      {o.name}: {o.price}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
