import { maxBy } from "lodash";

type Outcome = {
  name: string;
  price: number;
};

type Bookmaker = {
  key: string;
  markets: {
    key: string;
    outcomes: Outcome[];
  }[];
};

export function getBestOdds(bookmakers: Bookmaker[] | undefined): Outcome[] {
  if (!bookmakers || bookmakers.length === 0) return [];

  const market = "h2h";
  const allOutcomes: Outcome[] = [];

  for (const bookmaker of bookmakers) {
    const h2hMarket = bookmaker.markets.find((m) => m.key === market);
    if (h2hMarket) {
      allOutcomes.push(...h2hMarket.outcomes);
    }
  }

  // Agrupar por nome e pegar o melhor preço para cada um
  const uniqueNames = [...new Set(allOutcomes.map((o) => o.name))];

  return uniqueNames.map((name) => {
    const best = maxBy(allOutcomes.filter((o) => o.name === name), "price");
    return best!;
  });
}
