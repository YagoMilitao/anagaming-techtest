import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { OddData } from "../sports/[sport]/[id]/page";

export async function fetchOddsData() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY;
    if (!apiKey) {
      throw new Error("API key não definida. Verifique suas variáveis de ambiente.");
    }

    const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro ao buscar odds: ${res.status} - ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro em fetchOddsData:", error);
    throw error;
  }
}

export async function fetchOddById(sport: string, eventId: string): Promise<OddData | null> {
    const apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY;
    console.log("API Key:", apiKey);
    if (!apiKey) {
        console.error("API key não definida.");
        return null;
    }

    // A URL da API está correta
    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds?apiKey=${apiKey}&regions=us`;
    console.log("URL da API:", apiUrl);

    try {
        const response = await fetch(apiUrl);
        console.log("Resposta da API:", response);
        console.log("response.ok:", response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            const message = `Erro ao buscar evento com ID ${eventId} para o esporte ${sport}: ${response.status} - ${response.statusText} - ${errorText}`;
            console.error(message); // Log mais detalhado do erro da API
            return null;
        }

        // CORREÇÃO: Leia o corpo da resposta APENAS UMA VEZ como JSON
        // Removi a linha `const responseText = await response.text();`
        // e a linha `const data = await response.json();` duplicada.
        const data: OddData = await response.json(); 
        console.log("Dados brutos da API (direto do JSON):", data); // LOG DOS DADOS BRUTOS

        // CORREÇÃO: A API para um único evento retorna um OBJETO, não um ARRAY.
        // Verifique se 'data' é um objeto e não nulo.
        if (data && typeof data === 'object' && data !== null) {
            // Não precisamos de data[0] porque 'data' já é o objeto do evento
            const eventOddsData = data; 

            const oddDetails: OddData = {
                id: eventOddsData.id,
                sport_title: eventOddsData.sport_title,
                commence_time: eventOddsData.commence_time,
                home_team: eventOddsData.home_team,
                away_team: eventOddsData.away_team,
                bookmakers: eventOddsData.bookmakers || [],
                // Certifique-se de que 'eventId' e 'sport' são mapeados corretamente
                eventId: eventOddsData.id, // O ID do evento é o próprio 'id' do objeto
                sport: eventOddsData.sport_key || eventOddsData.sport_title || sport, // Use sport_key se disponível
                status: eventOddsData.status || "unknown",
                league_name: eventOddsData.league_name, // Adicione se presente na resposta da API
                sport_key: eventOddsData.sport_key, // Adicione se presente na resposta da API
            };
            console.log("Dados detalhados da API (com odds):", oddDetails);
            return oddDetails;
        } else {
            // Este log será executado se a API retornar um objeto vazio ou algo inesperado
            console.log("Nenhum dado de evento válido encontrado para ID:", eventId, "Resposta da API:", data);
            return null;
        }
    } catch (error: any) {
        console.error(`Erro ao buscar detalhes do evento ${eventId} para o esporte ${sport}:`, error);
        return null;
    }
}

export async function fetchSports() {
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.ODDS_API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) throw new Error('Erro ao buscar odds');
  return res.json();
}

export const fetchFavorites = async (email: string) => {
  const res = await fetch(`${process.env.API_URL}/favorites?email=${email}`);
  if (!res.ok) throw new Error('Erro ao buscar favoritos');
  return res.json();
}

export async function fetchAllSports() {
  const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.NEXT_PUBLIC_ODDS_API_KEY}`);

  if (!res.ok) {
    throw new Error('Erro ao buscar todos os esportes');
  }

  return await res.json();
}

export const saveFavorite = async (sport: string) => {
  const res = await fetch(`${process.env.API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sport }),
  });
  return res.json();
};