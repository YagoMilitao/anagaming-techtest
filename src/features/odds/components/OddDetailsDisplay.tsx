"use client";

import { Odd, Bookmaker, Market, Outcome } from "@/data/Odd";
import { FaCalendarAlt, FaClock, FaTrophy } from "react-icons/fa";

interface OddDetailsDisplayProps {
  odd: Odd;
}

export function OddDetailsDisplay({ odd }: OddDetailsDisplayProps) {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">
          {odd.home_team} vs {odd.away_team}
        </h1>
        <div className="flex items-center text-gray-600 mb-2">
          <FaTrophy className="mr-2" />
          <span>
            {odd.sport_title} - {odd.league_name || "Nome Indisponivel"}
          </span>{" "}
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>{new Date(odd.commence_time).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2" />
          <span>{new Date(odd.commence_time).toLocaleTimeString()}</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">Odds</h2>
        {odd.bookmakers.map((bookmaker: Bookmaker) => (
          <div key={bookmaker.key} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-blue-700">{bookmaker.title}</h3>
            {bookmaker.markets.map((market: Market, marketIndex: number) => (
              <div key={market.key + marketIndex} className="mb-3">
                <p className="font-semibold text-gray-700 mb-2">Mercado: {market.key}</p>
                <div className="flex flex-wrap gap-4">
                  {market.outcomes.map((outcome: Outcome, outcomeIndex: number) => (
                    <div
                      key={outcome.name + outcomeIndex}
                      className="bg-gray-100 p-3 rounded-md border border-gray-300"
                    >
                      <span className="block font-medium text-gray-800">{outcome.name}</span>
                      <span className="text-blue-600 text-lg font-bold">
                        {typeof outcome.price === "number"
                          ? outcome.price.toFixed(2)
                          : Number(outcome.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
