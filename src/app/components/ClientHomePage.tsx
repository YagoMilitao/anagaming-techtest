"use client";

import React from "react";
import { Session } from "next-auth";
import SportsFilter from "@/features/odds/components/SportsFilter";
import OddsList from "@/features/odds/components/OddsList";
import { useOddsHomeViewModel } from "@/features/odds/hooks/useOddsHomeViewModel";
import DropdownAccordion from "./DropdownAccordion";
import LoginButton from "./User/LoginButton";
import UserPanel from "./User/UserPanel";
import OddsSkeleton from "./OddsSkeleton";
import { Odd } from "@/data/Odd";

interface ClientHomePageProps {
  initialOdds: Odd[];
  session: Session | null;
  serverRenderedTimestamp: number;
  errorMessage?: string | null;
}

function ClientHomePage({ initialOdds, session, serverRenderedTimestamp, errorMessage }: ClientHomePageProps) {
  const { liveGames, futureGames, finishedGames, loading, favoriteSports, toggleFavoriteSport } = useOddsHomeViewModel({
    initialOdds,
    serverRenderedTimestamp,
  });

  if (loading) {
    return <OddsSkeleton count={5} />;
  }

  if (errorMessage) {
    return (
      <main className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Erro ao carregar dados!</h1>
        <p className="mb-2 text-gray-700 text-center text-lg">{errorMessage}</p>
        <p className="text-gray-500 text-sm mt-4">Por favor, tente novamente mais tarde.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-screen-xl">
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-md"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}
      <UserPanel session={session}>
        {session ? (
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Bem-vindo à Anagaming!</h1>
            <p className="text-lg text-gray-700">Explore e gerencie suas apostas.</p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <p className="mb-4 text-gray-700 text-lg">
              Explore as odds ao vivo abaixo. Faça login para acessar recursos como favoritos.
            </p>
            <LoginButton />
          </div>
        )}
      </UserPanel>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Apostas ao Vivo</h2>
        {session && favoriteSports.length > 0 && (
          <button
            onClick={() => favoriteSports.forEach((sport) => toggleFavoriteSport(sport))}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full font-semibold shadow-md transition-all duration-200 ease-in-out"
            aria-label="Limpar categorias favoritas"
          >
            Limpar categorias favoritas
          </button>
        )}
      </div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <SportsFilter />
      </div>
      <section className="space-y-4">
        {" "}
        <DropdownAccordion
          title={<span className="text-xl font-semibold">Jogos Ao Vivo</span>}
          defaultOpen
          count={liveGames.length}
          status="live"
        >
          <OddsList odds={liveGames} />
        </DropdownAccordion>
        <DropdownAccordion
          title={<span className="text-xl font-semibold">Jogos Futuros</span>}
          defaultOpen
          count={futureGames.length}
          status="future"
        >
          <OddsList odds={futureGames} />
        </DropdownAccordion>
        <DropdownAccordion
          title={<span className="text-xl font-semibold">Jogos Encerrados</span>}
          count={finishedGames.length}
          status="finished"
        >
          <OddsList odds={finishedGames} />
        </DropdownAccordion>
      </section>
    </main>
  );
}
export default ClientHomePage;
