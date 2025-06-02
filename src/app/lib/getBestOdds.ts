import { Bookmaker, Outcome } from "@/data/Odd";
import _ from "lodash";
export interface BestOutcomeDetail {
  name: string;
  price: number;
  bookmakerName: string;
}

/**
 * Encontra a melhor odd (preço mais alto) para cada outcome distinto
 * dentro do mercado 'h2h' (Head-to-Head) de todos os bookmakers.
 * @param bookmakers O array de bookmakers de um evento.
 * @returns Um array de objetos com o nome do outcome, o melhor preço e o nome do bookmaker.
 */
export function getBestOdds(bookmakers: Bookmaker[]): BestOutcomeDetail[] {
  const h2hMarkets = _.flatMap(bookmakers, (bookmaker) =>
    _.filter(bookmaker.markets, { key: "h2h" })
  );

  if (_.isEmpty(h2hMarkets)) {
    return [];
  }

  const allOutcomes: (Outcome & { bookmakerName: string })[] = _.flatMap(
    h2hMarkets,
    (market) => {
      const parentBookmaker = _.find(bookmakers, (bm) =>
        _.some(bm.markets, (m) => m === market)
      );
      return _.map(market.outcomes, (outcome) => ({
        ...outcome,
        bookmakerName: parentBookmaker ? parentBookmaker.title : "Unknown",
      }));
    }
  );
  
  const groupedOutcomes = _.groupBy(allOutcomes, "name");
  const bestOutcomes: BestOutcomeDetail[] = [];

  _.forOwn(groupedOutcomes, (outcomesForName, _outcomeName) => {
    const bestOutcome = _.maxBy(outcomesForName, "price");

    if (bestOutcome) {
      bestOutcomes.push({
        name: bestOutcome.name,
        price: bestOutcome.price,
        bookmakerName: bestOutcome.bookmakerName,
      });
    }
  });

  return bestOutcomes;
}