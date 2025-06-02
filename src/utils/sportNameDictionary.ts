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
  AmericanFootball: "Futebol Americano",
  rugby: "Rugby",
  handball: "Handebol",
  volleyball: "Vôlei",
  tableTennis: "Tênis de Mesa",
  boxing: "Boxe",
  motorsport: "Motorsport",
  cycling: "Ciclismo",
  swimming: "Natação",
  athletics: "Atletismo",
  wrestling: "Luta Livre",
  futsal: "Futsal",
  badminton: "Badminton",
  waterpolo: "Pólo Aquático",
  darts: "Dardos",
  snooker: "Sinuca",
  formula1: "Fórmula 1",
  formulaE: "Fórmula E",
  lacrosse: "Lacrosse",
};

export const getSportName = (sportKey: string): string => {
  const prefix = sportKey.split("_")[0];
  return sportNameMap[prefix] || prefix;
};
