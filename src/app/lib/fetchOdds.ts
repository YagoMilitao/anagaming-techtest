import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

export async function fetchOddsById(id: string) {
  const all = await fetchOddsData();
  return all.find((game: any) => game.id === id);
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

export const saveFavorite = async (sport: string) => {
  const res = await fetch(`${process.env.API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sport }),
  });
  return res.json();
};