// src/utils/oddsCalculation.ts

import { Bookmaker, Odd } from "@/data/Odd";
// Importa a nova interface e a função ajustada
import { getBestOdds, BestOutcomeDetail } from "@/app/lib/getBestOdds";

interface BestTeamOddsResult {
  bestPriceHome: number | null;
  bestOutcomeHome: string | null;
  bestBookmakerHome: string | null;
  bestPriceAway: number | null;
  bestOutcomeAway: string | null;
  bestBookmakerAway: string | null;
  bestPriceDraw: number | null;
  bestBookmakerDraw: string | null;
}

/**
 * Encontra as melhores odds para os times da casa, fora e empate (se aplicável)
 * dentro do mercado H2H dos bookmakers.
 * @param bookmakers O array de bookmakers do evento.
 * @param odd O objeto Odd completo.
 * @returns As melhores odds para cada time/empate, incluindo o nome do bookmaker.
 */
export function getBestTeamOdds(bookmakers: Bookmaker[], odd: Odd): BestTeamOddsResult {
  const bestOutcomes: BestOutcomeDetail[] = getBestOdds(bookmakers); // Agora, retorna BestOutcomeDetail[]

  let bestPriceHome: number | null = null;
  let bestOutcomeHome: string | null = null;
  let bestBookmakerHome: string | null = null;

  let bestPriceAway: number | null = null;
  let bestOutcomeAway: string | null = null;
  let bestBookmakerAway: string | null = null;

  let bestPriceDraw: number | null = null;
  let bestBookmakerDraw: string | null = null;

  // Encontra as odds para o time da casa
  const homeOdd = bestOutcomes.find((o) => o.name === odd.home_team);
  if (homeOdd) {
    bestPriceHome = homeOdd.price;
    bestOutcomeHome = homeOdd.name;
    bestBookmakerHome = homeOdd.bookmakerName; // !!! Pegando o nome do bookmaker
  }

  // Encontra as odds para o time visitante
  const awayOdd = bestOutcomes.find((o) => o.name === odd.away_team);
  if (awayOdd) {
    bestPriceAway = awayOdd.price;
    bestOutcomeAway = awayOdd.name;
    bestBookmakerAway = awayOdd.bookmakerName; // !!! Pegando o nome do bookmaker
  }

  // Encontra as odds para "Draw" (Empate), se existir
  const drawOdd = bestOutcomes.find((o) => o.name === "Draw");
  if (drawOdd) {
    bestPriceDraw = drawOdd.price;
    bestBookmakerDraw = drawOdd.bookmakerName; // !!! Pegando o nome do bookmaker
  }

  return {
    bestPriceHome,
    bestOutcomeHome,
    bestBookmakerHome,
    bestPriceAway,
    bestOutcomeAway,
    bestBookmakerAway,
    bestPriceDraw,
    bestBookmakerDraw,
  };
}
