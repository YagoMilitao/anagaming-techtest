export async function fetchOddsData() {
  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) throw new Error('Erro ao buscar odds');
  return res.json();
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