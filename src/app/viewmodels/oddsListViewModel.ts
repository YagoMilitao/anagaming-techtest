import { OddData } from '@/app/sports/[sport]/[id]/page';

export function getBestH2HOutcome(
  bookmakers: OddData['bookmakers'],
  odd: OddData
) {
  let bestPriceHome = -1;
  let bestPriceAway = -1;
  let bestOutcomeHome: string | null = null;
  let bestOutcomeAway: string | null = null;
  let bestBookmakerHome: string | null = null;
  let bestBookmakerAway: string | null = null;

  bookmakers.forEach((bookmaker) => {
    const h2hMarket = bookmaker.markets?.find((market) => market.key === 'h2h');
    if (h2hMarket?.outcomes) {
      h2hMarket.outcomes.forEach((outcome) => {
        const price =
          typeof outcome.price === 'number'
            ? outcome.price
            : parseFloat(outcome.price);

        if (outcome.name?.toLowerCase().includes(odd.home_team.toLowerCase())) {
          if (price > bestPriceHome) {
            bestPriceHome = price;
            bestOutcomeHome = outcome.name;
            bestBookmakerHome = bookmaker.title;
          }
        } else if (
          outcome.name?.toLowerCase().includes(odd.away_team.toLowerCase())
        ) {
          if (price > bestPriceAway) {
            bestPriceAway = price;
            bestOutcomeAway = outcome.name;
            bestBookmakerAway = bookmaker.title;
          }
        }
      });
    }
  });

  return {
    bestPriceHome: bestPriceHome > 0 ? bestPriceHome.toFixed(2) : '-',
    bestOutcomeHome,
    bestBookmakerHome,
    bestPriceAway: bestPriceAway > 0 ? bestPriceAway.toFixed(2) : '-',
    bestOutcomeAway,
    bestBookmakerAway,
  };
}
