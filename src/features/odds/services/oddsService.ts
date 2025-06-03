import { Odd, SportGroup, Sport } from "@/data/Odd";

function getApiKey(): string {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    console.error("Variável de ambiente ODDS_API_KEY não está definida.");
    throw new Error(
      "Chave da API para o serviço de odds não configurada. Por favor, verifique suas variáveis de ambiente.",
    );
  }
  return apiKey;
}

export async function getOddDetails(id: string): Promise<Odd | null> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/${id}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h&oddsFormat=decimal`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 5 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      const errorText = await res.text();
      console.error(`Erro ao buscar detalhes da odd (${id}): ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Falha ao buscar detalhes da odd para o ID ${id}. Status: ${res.status}`);
    }

    const data: Odd[] = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Erro no lado do servidor em getOddDetails para o ID ${id}:`, error);
    throw error;
  }
}

export async function getUpcomingOdds(): Promise<Odd[]> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,spreads,totals&oddsFormat=decimal`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erro ao buscar odds futuras: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Falha ao buscar odds futuras. Status: ${res.status}`);
    }

    const data: Odd[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("getUpcomingOdds: A resposta da API não é um array de Odd.", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erro no lado do servidor em getUpcomingOdds:", error);
    throw error;
  }
}

export async function fetchSpecificOddByEventId(sportKey: string, eventId: string): Promise<Odd | null> {
  const apiKey = getApiKey();
  const apiUrl = `https://api.the-odds-api.com/v4/sports/${sportKey}/events/${eventId}/odds?apiKey=${apiKey}&regions=eu&oddsFormat=decimal`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorText = await response.text();
      console.error(
        `Erro ao buscar evento ${eventId} para esporte ${sportKey}: ${response.status} - ${response.statusText} - ${errorText}`,
      );
      throw new Error(`Falha ao buscar odd específica para o evento ${eventId}. Status: ${response.status}`);
    }

    const data: Odd[] = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Erro no lado do servidor em fetchSpecificOddByEventId para o evento ${eventId}:`, error);
    throw error;
  }
}

export async function getSportGroups(): Promise<SportGroup[]> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erro ao buscar grupos de esporte: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Falha ao buscar grupos de esporte. Status: ${res.status}`);
    }

    const data: Sport[] = await res.json();

    if (!Array.isArray(data)) {
      console.error("getSportGroups: A resposta da API não é um array de Sport.", data);
      return [];
    }

    const grouped: { [group: string]: string[] } = {};
    data.forEach((sport: Sport) => {
      if (!grouped[sport.group]) {
        grouped[sport.group] = [];
      }
      grouped[sport.group].push(sport.key);
    });

    return Object.entries(grouped).map(([group, keys]) => ({ group, keys }));
  } catch (error) {
    console.error("Erro no lado do servidor em getSportGroups:", error);
    throw error;
  }
}

export async function getAllSports(): Promise<Sport[]> {
  const apiKey = getApiKey();
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erro ao buscar todos os esportes: ${res.status} - ${res.statusText} - ${errorText}`);
      throw new Error(`Falha ao buscar todos os esportes. Status: ${res.status}`);
    }
    const data: Sport[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("getAllSports: A resposta da API não é um array de Sport.", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erro no lado do servidor em getAllSports:", error);
    throw error;
  }
}
