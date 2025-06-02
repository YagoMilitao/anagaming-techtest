// src/features/odds/hooks/useOddsHomeViewModel.ts
import { useState, useEffect, useMemo } from "react";
import { useOddsContext } from "@/features/odds/context/OddsContext";
import { Odd } from "@/data/Odd";
import {
  filterOddsBySportKeys,
  categorizeOddsByTime,
  sortOddsByCommenceTimeAsc,
  sortOddsByCommenceTimeDesc,
} from "./oddsProcessing";

interface UseOddsHomeViewModelProps {
  initialOdds: Odd[];
  serverRenderedTimestamp: number; // Propriedade vinda do Server Component
}

interface OddsHomeViewModel {
  liveGames: Odd[];
  futureGames: Odd[];
  finishedGames: Odd[];
  loading: boolean;
  selectedSport: string;
  allSports: { group: string; keys: string[] }[];
  favoriteSports: string[];
  toggleFavoriteSport: (sport: string) => void;
}

export function useOddsHomeViewModel({
  initialOdds,
  serverRenderedTimestamp,
}: UseOddsHomeViewModelProps): OddsHomeViewModel {
  const [odds, setOdds] = useState<Odd[]>(initialOdds);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false); // Mantido por consistência, mas não para a busca inicial

  // `clientCurrentTime` será a referência de tempo dinâmico para categorização.
  // É inicializado com o tempo do servidor para garantir hidratação consistente.
  const [clientCurrentTime, setClientCurrentTime] = useState(serverRenderedTimestamp);

  const { selectedSport, favoriteSports, toggleFavoriteSport, allSports } = useOddsContext();

  // Sincroniza o estado interno `odds` se `initialOdds` mudar do Server Component
  // E configura o intervalo para atualizar o tempo no cliente.
  useEffect(() => {
    setOdds(initialOdds); // Atualiza as odds se o servidor enviar novas

    // Configura o intervalo para atualizar `clientCurrentTime` a cada minuto.
    // Isso fará com que as categorias de jogos (Ao Vivo, Futuros, Encerrados)
    // se ajustem dinamicamente no navegador após a hidratação.
    const intervalId = setInterval(() => {
      setClientCurrentTime(Date.now());
    }, 60 * 1000); // A cada 1 minuto

    // Limpa o intervalo quando o componente é desmontado ou quando as dependências mudam
    return () => clearInterval(intervalId);
  }, [initialOdds, serverRenderedTimestamp]); // Dependências: initialOdds e serverRenderedTimestamp

  // Lógica de filtragem baseada no esporte selecionado
  const filteredOdds = useMemo(() => {
    const selectedGroup = allSports.find((g) => g.group === selectedSport);
    const selectedKeys: string[] = selectedGroup ? selectedGroup.keys : [];
    return filterOddsBySportKeys(odds, selectedKeys);
  }, [odds, selectedSport, allSports]);

  // Lógica de categorização dos jogos (Ao Vivo, Futuros, Encerrados)
  // Usa `clientCurrentTime` que é consistente na hidratação e dinâmico depois.
  const { liveGames, futureGames, finishedGames } = useMemo(() => {
    // A função categorizeOddsByTime usará `clientCurrentTime` que é o `serverRenderedTimestamp`
    // no lado do servidor e o tempo real atualizado no cliente.
    return categorizeOddsByTime(filteredOdds, clientCurrentTime);
  }, [filteredOdds, clientCurrentTime]); // `clientCurrentTime` é a dependência crucial para re-categorizar

  // Lógica de ordenação das categorias
  // As funções de ordenação agora incluem um critério de desempate por ID.
  const sortedLiveGames = useMemo(() => sortOddsByCommenceTimeAsc(liveGames), [liveGames]);
  const sortedFutureGames = useMemo(() => sortOddsByCommenceTimeAsc(futureGames), [futureGames]);
  const sortedFinishedGames = useMemo(() => sortOddsByCommenceTimeDesc(finishedGames), [finishedGames]);

  return {
    liveGames: sortedLiveGames,
    futureGames: sortedFutureGames,
    finishedGames: sortedFinishedGames,
    loading,
    selectedSport,
    allSports,
    favoriteSports,
    toggleFavoriteSport,
  };
}
