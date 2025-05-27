export function getAvailableSports(data: any[]) {
  return Array.from(new Set(data.map(item => item.sport_key)));
}

export function getAvailableLeagues(data: any[], sport: string) {
  return Array.from(
    new Set(
      data
        .filter(item => item.sport_key === sport)
        .map(item => item.league_name || item.sport_title)
    )
  );
}
