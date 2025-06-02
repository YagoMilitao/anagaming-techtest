// src/app/sports/[sport]/[id]/page.tsx
import { fetchOddById } from "@/app/lib/fetchOdds";
import OddsDetailPageContent from "@/features/odds/details/OddsDetailPageContent";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Interface para os parâmetros da URL
interface PageParams {
  sport: string;
  id: string;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id, sport } = params as PageParams;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: odd, error } = await fetchOddById(sport, id);

  if (!odd || error) {
    return {
      title: "Evento Esportivo Não Encontrado | Anagaming",
      description: "O evento esportivo que você procura não foi encontrado ou está indisponível.",
      robots: { index: false, follow: false },
    };
  }

  const eventTitle = `${odd.home_team} vs ${odd.away_team}`;
  const formattedSportName = sport
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const baseUrl = "https://anagaming-techtest.vercel.app";

  return {
    title: `${eventTitle} - Odds de ${formattedSportName} | Anagaming`,
    description: `Acompanhe as odds ao vivo e informações detalhadas para o jogo de ${formattedSportName}: ${eventTitle}. Veja as melhores cotações e prepare suas apostas.`,
    keywords: [
      `${odd.home_team} odds`,
      `${odd.away_team} odds`,
      `${formattedSportName} apostas`,
      `${eventTitle} prognóstico`,
      "odds ao vivo",
      "apostas esportivas",
      odd.home_team,
      odd.away_team,
      formattedSportName,
    ],
    openGraph: {
      title: `${eventTitle} - Odds de ${formattedSportName} | Anagaming`,
      description: `Odds e informações para o jogo ${eventTitle} de ${formattedSportName}.`,
      url: `${baseUrl}/sports/${sport}/${id}`,
      images: [
        {
          url: `${baseUrl}/images/logo.jpg`,
          width: 1200,
          height: 630,
          alt: `${eventTitle} Odds`,
        },
      ],
      type: "website",
    },
  };
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OddDetailsPage({ params }: { params: any }) {
  const { sport, id } = params as PageParams;
  const { data: odd, error } = await fetchOddById(sport, id);

  if (!odd || error) {
    notFound();
  }

  return <OddsDetailPageContent odd={odd} error={error} />;
}
