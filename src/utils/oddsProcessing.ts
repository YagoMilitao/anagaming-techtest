import { Odd } from "@/data/Odd";

/**
 * Filtra uma lista de odds por um array de chaves de esporte.
 * Se o array sportKeys estiver vazio, todas as odds são retornadas.
 */
export function filterOddsBySportKeys(odds: Odd[], sportKeys: string[]): Odd[] {
  // 'all' é uma chave especial que indica para não aplicar filtro de esporte
  if (sportKeys.length === 0 || sportKeys.includes("all")) {
    return odds;
  }
  return odds.filter((odd) => sportKeys.includes(odd.sport_key));
}

/**
 * Categoriza as odds em jogos ao vivo, futuros e finalizados com base no tempo atual.
 * @param odds O array de objetos Odd para categorizar.
 * @param currentTime O timestamp atual em milissegundos.
 */
export function categorizeOddsByTime(odds: Odd[], currentTime: number) {
  const liveGames: Odd[] = [];
  const futureGames: Odd[] = [];
  const finishedGames: Odd[] = [];

  odds.forEach((odd) => {
    const commenceTime = new Date(odd.commence_time).getTime(); // Converte string ISO para timestamp

    // Aqui usamos uma heurística simples para "ao vivo":
    // iniciado mas não há muito tempo.
    // Uma implementação mais robusta de "ao vivo" viria da própria API.
    const fiveHoursAgo = currentTime - 5 * 60 * 60 * 1000; // 5 horas em milissegundos

    if (commenceTime <= currentTime && commenceTime > fiveHoursAgo) {
      // Considerado "ao vivo" se começou nas últimas 5 horas
      liveGames.push(odd);
    } else if (commenceTime > currentTime) {
      futureGames.push(odd);
    } else {
      // Todos os outros jogos passados são considerados finalizados
      finishedGames.push(odd);
    }
  });

  return { liveGames, futureGames, finishedGames };
}

/**
 * Ordena as odds pela hora de início em ordem ascendente (o mais cedo primeiro).
 */
export function sortOddsByCommenceTimeAsc(odds: Odd[]): Odd[] {
  return [...odds].sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
}

/**
 * Ordena as odds pela hora de início em ordem descendente (o mais recente primeiro).
 */
export function sortOddsByCommenceTimeDesc(odds: Odd[]): Odd[] {
  return [...odds].sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime());
}
