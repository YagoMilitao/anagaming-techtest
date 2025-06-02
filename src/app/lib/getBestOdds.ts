import { Bookmaker, Market, Outcome } from "@/data/Odd";

export interface BestOutcomeDetail {
  name: string;
  price: number;
  bookmakerName: string; // Adicionado: Nome da casa de apostas
}

/**
 * Esta função recebe um array de casas de apostas (bookmakers) e retorna as melhores odds
 * (preços) para cada nome de resultado (outcome name) único no mercado "h2h" (Head-to-Head).
 *
 * Ele filtra os bookmakers para encontrar o mercado "h2h" e coleta todos os resultados (outcomes)
 * desse mercado. Em seguida, encontra o preço máximo para cada nome de resultado único
 * e retorna um array desses resultados com as melhores odds.
 *
 * @param {Bookmaker[] | undefined} bookmakers - Um array de bookmakers ou undefined.
 * @returns {Outcome[]} Um array de resultados com as melhores odds para cada nome de resultado único.
 */
/**
 * Encontra a melhor odd (preço mais alto) para cada outcome distinto
 * dentro do mercado 'h2h' (Head-to-Head) de todos os bookmakers.
 * @param bookmakers O array de bookmakers de um evento.
 * @returns Um array de objetos com o nome do outcome, o melhor preço e o nome do bookmaker.
 */
export function getBestOdds(bookmakers: Bookmaker[]): BestOutcomeDetail[] {
  const bestOutcomesMap = new Map<string, BestOutcomeDetail>();

  bookmakers.forEach((bookmaker) => {
    // Encontra o mercado 'h2h' (Head-to-Head)
    const h2hMarket = bookmaker.markets.find((market: Market) => market.key === "h2h");

    if (h2hMarket) {
      h2hMarket.outcomes.forEach((outcome: Outcome) => {
        // Se este outcome já existe no mapa e o preço atual é menor ou igual,
        // ou se o outcome não existe no mapa, atualiza.
        // Queremos o preço MAIS ALTO.
        if (!bestOutcomesMap.has(outcome.name) || outcome.price > bestOutcomesMap.get(outcome.name)!.price) {
          bestOutcomesMap.set(outcome.name, {
            name: outcome.name,
            price: outcome.price,
            bookmakerName: bookmaker.title, // !!! Agora inclui o nome do bookmaker
          });
        }
      });
    }
  });

  return Array.from(bestOutcomesMap.values());
}
