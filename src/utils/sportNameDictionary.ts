const sportNameMap: { [key: string]: string } = {
  soccer: "Futebol",
  basketball: "Basquete",
  baseball: "Beisebol",
  tennis: "Tênis",
  hockey: "Hóquei",
  mma: "MMA",
  cricket: "Críquete",
  esports: "eSports",
  golf: "Golfe",
};

export const getSportName = (sportKey: string): string => {
  const prefix = sportKey.split('_')[0];
  return sportNameMap[prefix] || prefix;
};
