// src/features/odds/services/oddsService.ts

import { Odd, SportGroup, Sport } from "@/data/Odd";

// Função auxiliar para obter a API Key e lançar um erro se não estiver definida
function getApiKey(): string {
  const apiKey = process.env.ODDS_API_KEY; // **APENAS ACESSÍVEL NO SERVIDOR**
  if (!apiKey) {
    console.error("Environment variable ODDS_API_KEY is not defined.");
    throw new Error("API Key for odds service is not configured. Please check your environment variables.");
  }
  return apiKey;
}

// 1. Busca detalhes de uma odd específica (usado em bets/[id]/page.tsx)
export async function getOddDetails(id: string): Promise<Odd | null> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/${id}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h&oddsFormat=decimal`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 5 }, // Revalida a cada 5 minutos
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      const errorText = await res.text();
      console.error(`Error fetching odd details (${id}): ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch odd details for ID ${id}. Status: ${res.status}`);
    }

    const data: Odd[] = await res.json();
    // A API The Odds API retorna um array, mesmo para um ID específico.
    return data[0] || null;
  } catch (error) {
    console.error(`Server-side error in getOddDetails for ID ${id}:`, error);
    throw error; // Propagar o erro para o error.tsx ou para o chamador
  }
}

// 2. Busca uma lista de odds futuras (equivalente ao seu fetchOddsData)
export async function getUpcomingOdds(): Promise<Odd[]> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,spreads,totals&oddsFormat=decimal`;

  try {
    const res = await fetch(url, { cache: "no-store" }); // Sem cache para dados que mudam rapidamente

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching upcoming odds: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch upcoming odds. Status: ${res.status}`);
    }

    const data: Odd[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("getUpcomingOdds: API response is not an array of Odd.", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Server-side error in getUpcomingOdds:", error);
    throw error;
  }
}

// 3. Busca uma odd específica por esporte e ID do evento (equivalente ao seu fetchOddById)
// Note que getOddDetails já faz algo similar, mas esta tem sport e eventId.
// Se a API for diferente para esta, mantenha-a. Se for redundante, remova.
export async function fetchSpecificOddByEventId(sportKey: string, eventId: string): Promise<Odd | null> {
  const apiKey = getApiKey();
  const apiUrl = `https://api.the-odds-api.com/v4/sports/${sportKey}/events/${eventId}/odds?apiKey=${apiKey}&regions=eu&oddsFormat=decimal`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorText = await response.text();
      console.error(
        `Error fetching event ${eventId} for sport ${sportKey}: ${response.status} - ${response.statusText} - ${errorText}`,
      );
      throw new Error(`Failed to fetch specific odd for event ${eventId}. Status: ${response.status}`);
    }

    const data: Odd[] = await response.json();
    // Novamente, assumimos que retorna um array e pegamos o primeiro item.
    return data[0] || null;
  } catch (error) {
    console.error(`Server-side error in fetchSpecificOddByEventId for event ${eventId}:`, error);
    throw error;
  }
}

// 4. Busca grupos de esportes (equivalente ao seu fetchSports)
export async function getSportGroups(): Promise<SportGroup[]> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 }, // Cache por 24 horas, já que a lista de esportes não muda muito
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching sport groups: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch sport groups. Status: ${res.status}`);
    }
    const data: SportGroup[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("getSportGroups: API response is not an array of SportGroup.", data);
      return [];
    }
    // Transformar para o formato { group: string, keys: string[] } se a API não retornar assim
    const grouped: { [group: string]: string[] } = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((sport: any) => {
      // 'any' temporário, tipar Sport corretamente
      if (!grouped[sport.group]) grouped[sport.group] = [];
      grouped[sport.group].push(sport.key);
    });
    return Object.entries(grouped).map(([group, keys]) => ({ group, keys }));
  } catch (error) {
    console.error("Server-side error in getSportGroups:", error);
    throw error;
  }
}

// 5. Busca todos os esportes (equivalente ao seu fetchAllSports)
// Se 'fetchSports' e 'fetchAllSports' da API forem o mesmo endpoint,
// você pode remover um e usar apenas getSportGroups.
// Se eles retornam estruturas diferentes ou dados diferentes, mantenha ambos.
export async function getAllSports(): Promise<Sport[]> {
  // Assumindo que retorna Sport[]
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`; // URL é a mesma?

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching all sports: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch all sports. Status: ${res.status}`);
    }
    const data: Sport[] = await res.json(); // Assumindo que a API retorna Sport[]
    if (!Array.isArray(data)) {
      console.error("getAllSports: API response is not an array of Sport.", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Server-side error in getAllSports:", error);
    throw error;
  }
}
