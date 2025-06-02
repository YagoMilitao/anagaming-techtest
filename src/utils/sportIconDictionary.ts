// src/utils/sportIconDictionary.ts
import React from "react";

// Importe ícones de diferentes fontes do react-icons
// Font Awesome (Fa)
import {
  FaFutbol, // Futebol
  FaBasketballBall, // Basquete
  FaBaseballBall, // Beisebol
  FaHockeyPuck, // Hóquei
  FaGamepad, // eSports
  FaGolfBall, // Golfe (Font Awesome tem!)
  FaFootballBall, // Futebol Americano (bola oval)
  FaVolleyballBall, // Vôlei (Font Awesome tem!)
  FaTableTennis, // Tênis de Mesa (Font Awesome tem!)
  FaCar, // Motorsport
  FaBiking, // Ciclismo
  FaSwimmer, // Natação (Font Awesome tem!)
  FaRunning, // Atletismo
  FaDumbbell, // Luta Livre (genérico)
  FaBullseye, // Dardos (alvo)
  FaMedal, // Medalha (genérico)
} from "react-icons/fa"; // Importa de Font Awesome (precisa do pacote 'fa')

// Material Design Icons (Md) - para alternativas ou se preferir o estilo
import { MdSportsTennis, MdSportsHandball, MdSportsCricket, MdSportsRugby, MdSportsMma } from "react-icons/md"; // Importa de Material Design Icons (precisa do pacote 'md')

import { BiSolidTennisBall } from "react-icons/bi";
interface SportIconMap {
  [key: string]: React.ElementType;
}

// Mapeamento de prefixos de sport_key para o componente de ícone
const sportIconMap: SportIconMap = {
  soccer: FaFutbol, // Font Awesome tem um bom ícone de futebol
  // Ou se preferir o estilo Material Design: 'soccer': MdSportsSoccer,

  basketball: FaBasketballBall,
  // Ou: 'basketball': MdSportsBasketball,

  baseball: FaBaseballBall,
  // Ou: 'baseball': MdSportsBaseball,

  tennis: BiSolidTennisBall,
  // Ou: 'tennis': MdSportsTennis,

  hockey: FaHockeyPuck, // Ícone de disco de hóquei
  // Ou: 'hockey': MdSportsHockey,

  mma: MdSportsMma, // Punho cerrado
  // Ou: 'mma': MdSportsMma,

  cricket: MdSportsCricket,
  // Ou: 'cricket': MdCricket, // Usando alias

  esports: FaGamepad,
  // Ou: 'esports': MdSportsEsports,

  golf: FaGolfBall, // Font Awesome tem um ótimo ícone de golfe
  // Ou: 'golf': MdSportsGolf,

  americanfootball: FaFootballBall, // Bola de futebol americano
  // Ou: 'americanfootball': MdSportsFootball, // Se existir no MD

  rugby: MdSportsRugby, // Bola de rugby
  // Ou: 'rugby': MdSportsRugby,

  handball: MdSportsHandball,
  // Ou: 'handball': MdSportsHandball,

  volleyball: FaVolleyballBall,
  // Ou: 'volleyball': MdSportsVolleyball,

  tabletennis: FaTableTennis, // Raquete e bola de tênis de mesa

  boxing: MdSportsMma, // Reusa o punho cerrado
  // Ou: 'boxing': MdSportsBoxing,

  motorsport: FaCar,
  // Ou: 'motorsport': MdSportsMotorsport,

  cycling: FaBiking,

  swimming: FaSwimmer,

  athletics: FaRunning, // Ícone de corredor

  wrestling: FaDumbbell, // Ícone de halter para luta

  futsal: FaFutbol, // Futsal é futebol

  badminton: MdSportsTennis, // Raquete similar ao tênis de mesa

  waterpolo: FaSwimmer, // Ou buscar um específico se existir, reusa nadador

  darts: FaBullseye, // Alvo

  snooker: FaMedal, // Mesa similar ao tênis de mesa

  formula1: FaCar, // Reusa carro
  formulae: FaCar, // Reusa carro

  lacrosse: FaMedal, // Reusa handebol (pode ser um genérico)
};

export const getSportIcon = (sportKey: string): React.ElementType | null => {
  const prefix = sportKey.split("_")[0];
  // Normalização para casos onde o prefixo não corresponde exatamente à chave do mapa (ex: AmericanFootball)
  const normalizedPrefix =
    Object.keys(sportIconMap).find(
      (key) =>
        key.toLowerCase() === prefix.toLowerCase() || (prefix === "AmericanFootball" && key === "americanfootball"),
    ) || prefix.toLowerCase();

  return sportIconMap[normalizedPrefix] || null;
};
