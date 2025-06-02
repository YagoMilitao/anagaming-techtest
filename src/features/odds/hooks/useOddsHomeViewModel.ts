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
  serverRenderedTimestamp: number;
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
  const [loading, setLoading] = useState(false);
  const [clientCurrentTime, setClientCurrentTime] = useState(serverRenderedTimestamp);
  const { selectedSport, favoriteSports, toggleFavoriteSport, allSports } = useOddsContext();

  useEffect(() => {
    setOdds(initialOdds);
    const intervalId = setInterval(() => {
      setClientCurrentTime(Date.now());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [initialOdds, serverRenderedTimestamp]);

  
  const filteredOdds = useMemo(() => {
    const selectedGroup = allSports.find((g) => g.group === selectedSport);
    const selectedKeys: string[] = selectedGroup ? selectedGroup.keys : [];
    return filterOddsBySportKeys(odds, selectedKeys);
  }, [odds, selectedSport, allSports]);

    const { liveGames, futureGames, finishedGames } = useMemo(() => {
    return categorizeOddsByTime(filteredOdds, clientCurrentTime);
  }, [filteredOdds, clientCurrentTime]);
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
