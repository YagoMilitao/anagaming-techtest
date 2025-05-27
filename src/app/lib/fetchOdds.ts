import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { OddData } from "../components/Odds/OddDetails";

export async function fetchOddsData() {
   try {
    const apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY
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
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) throw new Error("API key não definida");

  const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const message = `Erro ao buscar odds para evento ${eventId}: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    console.log("Odds detalhadas do evento:", data);
    return data as OddData;
  } catch (error: any) {
    console.error(`Erro ao buscar detalhes do evento ${eventId} com odds:`, error);
    return null;
  }
}

// export async function fetchOddById(sport: string, eventId: string): Promise<OddData | null> {
  
//   const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}?apiKey=${process.env.ODDS_API_KEY}`;

//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) {
//       const message = `Erro ao buscar evento com ID ${eventId} para o esporte ${sport}: ${response.status}`;
//       throw new Error(message);
//     }
//     const data = await response.json();

//     // A resposta da API para um evento específico conterá detalhes sobre esse evento,
//     // incluindo os bookmakers e suas odds. Você precisará adaptar sua interface
//     // `OddData` para corresponder à estrutura da resposta da The Odds API.

//     // Pode ser necessário extrair as informações relevantes e formatá-las
//     // para corresponder à sua interface `OddData`.

//     console.log("Dados da API:", data); // Para entender a estrutura da resposta
//     return data as any; // Adapte o tipo conforme a resposta da API
//   } catch (error: any) {
//     console.error(`Erro ao buscar detalhes do evento ${eventId} para o esporte ${sport}:`, error);
//     return null;
//   }
// }
// export async function fetchOddById(oddId: string): Promise<OddData> {
//   const response = await fetch(`/api/odds/${oddId}`); // Substitua pela URL correta da sua API
//   if (!response.ok) {
//     const message = `Erro ao buscar odd com ID ${oddId}: ${response.status}`;
//     throw new Error(message);
//   }
//   const data = await response.json();
//   return data as OddData;
// }

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