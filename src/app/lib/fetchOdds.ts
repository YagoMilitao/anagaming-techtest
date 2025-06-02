import { Odd, SportGroup } from "@/data/Odd";

interface OddsApiErrorResponse {
  message: string;
  error_code?: string;
  details_url?: string;
}

/**
 * Busca dados de odds de eventos futuros/próximos.
 * @returns Um objeto contendo um array de Odd ou um código de erro.
 */
export async function fetchOddsData(): Promise<{ data: Odd[]; error?: string }> {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      console.error("[API_KEY_MISSING] API key não definida para fetchOddsData. Verifique suas variáveis de ambiente.");
      return { data: [], error: "API_KEY_MISSING" };
    }

    const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`;
    const res = await fetch(url, { cache: "no-store" }); // Mantenha cache: "no-store" para suas páginas dinâmicas

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData: OddsApiErrorResponse = JSON.parse(errorText);
        if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
          console.warn(`[QUOTA_EXCEEDED] Sua cota de uso da API The Odds API foi atingida.`, errorData);
          return { data: [], error: "QUOTA_EXCEEDED" }; // Sinaliza erro de quota
        }
        throw new Error(`Erro da API: ${res.status} - ${errorData.message || errorText}`);
      } catch (_e: unknown) {
        throw new Error(`Erro ao buscar odds: ${res.status} - ${res.statusText} - ${errorText}`);
      }
    }

    const data: Odd[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("fetchOddsData: Resposta da API não é um array de Odd.", data);
      return { data: [], error: "INVALID_DATA_FORMAT" };
    }
    return { data };
  } catch (error: unknown) {
    console.error("Erro inesperado em fetchOddsData:", error);
    let errorMessage = "UNKNOWN_ERROR";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return { data: [], error: errorMessage };
  }
}

/**
 * BUSCA DE DADOS ESPECÍFICA PARA O SITEMAP
 * Busca dados de odds de eventos futuros/próximos com cache para permitir geração estática.
 * @returns Um objeto contendo um array de Odd ou um código de erro.
 */
export async function fetchOddsForSitemap(): Promise<{ data: Odd[]; error?: string }> {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      console.error(
        "[API_KEY_MISSING] API key não definida para fetchOddsForSitemap. Verifique suas variáveis de ambiente.",
      );
      return { data: [], error: "API_KEY_MISSING" };
    }

    const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache por 1 hora (3600 segundos) para o sitemap

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData: OddsApiErrorResponse = JSON.parse(errorText);
        if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
          console.warn(`[QUOTA_EXCEEDED] Sua cota de uso da API The Odds API foi atingida.`, errorData);
          return { data: [], error: "QUOTA_EXCEEDED" };
        }
        throw new Error(`Erro da API: ${res.status} - ${errorData.message || errorText}`);
      } catch (_e: unknown) {
        throw new Error(`Erro ao buscar odds para sitemap: ${res.status} - ${res.statusText} - ${errorText}`);
      }
    }

    const data: Odd[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("fetchOddsForSitemap: Resposta da API não é um array de Odd.", data);
      return { data: [], error: "INVALID_DATA_FORMAT" };
    }
    return { data };
  } catch (error: unknown) {
    console.error("Erro inesperado em fetchOddsForSitemap:", error);
    let errorMessage = "UNKNOWN_ERROR";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return { data: [], error: errorMessage };
  }
}

/**
 * Busca detalhes de odds para um evento específico pelo ID.
 * @param sport A chave do esporte (ex: "basketball_nba").
 * @param eventId O ID do evento.
 * @returns Um objeto contendo a Odd ou null, ou um código de erro.
 */
export async function fetchOddById(sport: string, eventId: string): Promise<{ data: Odd | null; error?: string }> {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      console.error("[API_KEY_MISSING] API key não definida para fetchOddById.");
      return { data: null, error: "API_KEY_MISSING" };
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds?apiKey=${apiKey}&regions=us`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData: OddsApiErrorResponse = JSON.parse(errorText);

        if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
          console.warn(`[QUOTA_EXCEEDED] Sua cota de uso da API The Odds API foi atingida.`, errorData);
          return { data: null, error: "QUOTA_EXCEEDED" };
        } else if (errorData.error_code === "EVENT_NOT_FOUND") {
          console.warn(
            `[EVENT_NOT_FOUND] Evento ${eventId} para o esporte ${sport} não encontrado ou expirou.`,
            errorData,
          );
          return { data: null, error: "EVENT_NOT_FOUND" };
        }
        return { data: null, error: `API_ERROR: ${errorData.message || errorText}` };
      } catch (_e) {
        return { data: null, error: `NETWORK_ERROR: ${response.status} - ${response.statusText}` };
      }
    }

    const data: Odd = await response.json();
    if (!data || typeof data !== "object" || !("id" in data) || !("sport_key" in data)) {
      console.warn(`fetchOddById: Dados recebidos para evento ${eventId} não são um objeto Odd válido.`, data);
      return { data: null, error: "INVALID_DATA_FORMAT" };
    }
    return { data };
  } catch (error: unknown) {
    console.error(`Erro inesperado ao buscar detalhes do evento ${eventId} para o esporte ${sport}:`, error);
    return { data: null, error: "UNKNOWN_ERROR" };
  }
}

/**
 * Busca uma lista de esportes disponíveis.
 * @returns Um objeto contendo um array de SportGroup ou um código de erro.
 */
export async function fetchSports(): Promise<{ data: SportGroup[]; error?: string }> {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      console.error("[API_KEY_MISSING] API key não definida para fetchSports.");
      return { data: [], error: "API_KEY_MISSING" };
    }
    const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData: OddsApiErrorResponse = JSON.parse(errorText);
        if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
          console.warn(`[QUOTA_EXCEEDED] Sua cota de uso da API The Odds API foi atingida.`, errorData);
          return { data: [], error: "QUOTA_EXCEEDED" };
        }
        throw new Error(`Erro da API: ${res.status} - ${errorData.message || errorText}`);
      } catch (_e: unknown) {
        throw new Error(`Erro ao buscar esportes: ${res.status} - ${res.statusText} - ${errorText}`);
      }
    }
    const data: SportGroup[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("fetchSports: Resposta da API não é um array de SportGroup.", data);
      return { data: [], error: "INVALID_DATA_FORMAT" };
    }
    return { data };
  } catch (error: unknown) {
    console.error("Erro inesperado em fetchSports:", error);
    return { data: [], error: "UNKNOWN_ERROR" };
  }
}

/**
 * Busca uma lista de todos os esportes disponíveis.
 * @returns Um objeto contendo um array de SportGroup ou um código de erro.
 */
export async function fetchAllSports(): Promise<{ data: SportGroup[]; error?: string }> {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      console.error("[API_KEY_MISSING] API key não definida para fetchAllSports.");
      return { data: [], error: "API_KEY_MISSING" };
    }
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`);

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData: OddsApiErrorResponse = JSON.parse(errorText);
        if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
          console.warn(`[QUOTA_EXCEEDED] Sua cota de uso da API The Odds API foi atingida.`, errorData);
          return { data: [], error: "QUOTA_EXCEEDED" };
        }
        throw new Error(`Erro da API: ${res.status} - ${errorData.message || errorText}`);
      } catch (_e) {
        throw new Error(`Erro ao buscar todos os esportes: ${res.status} - ${res.statusText} - ${errorText}`);
      }
    }
    const data: SportGroup[] = await res.json();
    if (!Array.isArray(data)) {
      console.error("fetchAllSports: Resposta da API não é um array de SportGroup.", data);
      return { data: [], error: "INVALID_DATA_FORMAT" };
    }
    return { data };
  } catch (error: unknown) {
    console.error("Erro inesperado em fetchAllSports:", error);
    return { data: [], error: "UNKNOWN_ERROR" };
  }
}
