import { Odd } from "@/data/Odd";

/**
 * Filtra uma lista de odds com base nas chaves de esporte selecionadas.
 * Se nenhuma chave for selecionada, retorna a lista original.
 * @param odds A lista completa de odds.
 * @param selectedSportKeys As chaves dos esportes pelos quais filtrar.
 * @returns Uma nova lista de odds filtradas.
 */
export function filterOddsBySportKeys(odds: Odd[], selectedSportKeys: string[]): Odd[] {
  if (!selectedSportKeys || selectedSportKeys.length === 0) {
    return odds;
  }
  return odds.filter((odd) => selectedSportKeys.includes(odd.sport_key));
}

/**
 * Classifica uma lista de odds em ordem crescente com base no tempo de início (commence_time).
 * Odds com tempos inválidos são colocadas no final. Inclui critério de desempate por ID.
 * @param games A lista de odds a ser classificada.
 * @returns Uma nova lista de odds classificadas.
 */
export function sortOddsByCommenceTimeAsc(games: Odd[]): Odd[] {
  return [...games].sort((a, b) => {
    const timeA = new Date(a.commence_time).getTime();
    const timeB = new Date(b.commence_time).getTime();

    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;
    if (timeA === timeB) {
      return a.id.localeCompare(b.id);
    }
    return timeA - timeB;
  });
}

/**
 * Classifica uma lista de odds em ordem decrescente com base no tempo de início (commence_time).
 * Odds com tempos inválidos são colocadas no final. Inclui critério de desempate por ID.
 * @param games A lista de odds a ser classificada.
 * @returns Uma nova lista de odds classificadas.
 */
export function sortOddsByCommenceTimeDesc(games: Odd[]): Odd[] {
  return [...games].sort((a, b) => {
    const timeA = new Date(a.commence_time).getTime();
    const timeB = new Date(b.commence_time).getTime();

    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;
    if (timeA === timeB) {
      return a.id.localeCompare(b.id);
    }
    return timeB - timeA;
  });
}

/**
 * Categoriza uma lista de odds em "ao vivo", "futuros" e "encerrados"
 * com base no tempo atual e um período de jogo assumido (3 horas).
 * @param odds A lista de odds a ser categorizada.
 * @param currentTime O timestamp de referência (Date.now()).
 * @param gameDurationMs A duração estimada de um jogo em milissegundos (padrão: 3 horas).
 * @returns Um objeto contendo listas de odds para cada categoria.
 */
export function categorizeOddsByTime(odds: Odd[], currentTime: number, gameDurationMs: number = 3 * 60 * 60 * 1000) {
  const liveGames: Odd[] = [];
  const futureGames: Odd[] = [];
  const finishedGames: Odd[] = [];

  odds.forEach((odd) => {
    const commenceTime = new Date(odd.commence_time).getTime();

    if (isNaN(commenceTime)) {
      return;
    }

    if (commenceTime <= currentTime && currentTime <= commenceTime + gameDurationMs) {
      liveGames.push(odd);
    } else if (commenceTime > currentTime) {
      futureGames.push(odd);
    } else if (commenceTime + gameDurationMs < currentTime) {
      finishedGames.push(odd);
    }
  });

  return { liveGames, futureGames, finishedGames };
}
