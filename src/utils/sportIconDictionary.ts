import React from "react";

import {
  FaFutbol,
  FaBasketballBall,
  FaBaseballBall,
  FaHockeyPuck,
  FaGamepad,
  FaGolfBall,
  FaFootballBall,
  FaVolleyballBall,
  FaTableTennis,
  FaCar,
  FaBiking,
  FaSwimmer,
  FaRunning,
  FaDumbbell,
  FaBullseye,
  FaMedal,
} from "react-icons/fa";

import { MdSportsTennis, MdSportsHandball, MdSportsCricket, MdSportsRugby, MdSportsMma } from "react-icons/md";

import { BiSolidTennisBall } from "react-icons/bi";
interface SportIconMap {
  [key: string]: React.ElementType;
}

const sportIconMap: SportIconMap = {
  soccer: FaFutbol,
  basketball: FaBasketballBall,
  baseball: FaBaseballBall,
  tennis: BiSolidTennisBall,
  hockey: FaHockeyPuck,
  mma: MdSportsMma,
  cricket: MdSportsCricket,
  esports: FaGamepad,
  golf: FaGolfBall,
  americanfootball: FaFootballBall,
  rugby: MdSportsRugby,
  handball: MdSportsHandball,
  volleyball: FaVolleyballBall,
  tabletennis: FaTableTennis,
  boxing: MdSportsMma,
  motorsport: FaCar,
  cycling: FaBiking,
  swimming: FaSwimmer,
  athletics: FaRunning,
  wrestling: FaDumbbell,
  futsal: FaFutbol,
  badminton: MdSportsTennis,
  waterpolo: FaSwimmer,
  darts: FaBullseye,
  snooker: FaMedal,
  formula1: FaCar,
  formulae: FaCar,
  lacrosse: FaMedal,
};

export const getSportIcon = (sportKey: string): React.ElementType | null => {
  const prefix = sportKey.split("_")[0];
  const normalizedPrefix =
    Object.keys(sportIconMap).find(
      (key) =>
        key.toLowerCase() === prefix.toLowerCase() || (prefix === "AmericanFootball" && key === "americanfootball"),
    ) || prefix.toLowerCase();

  return sportIconMap[normalizedPrefix] || null;
};
