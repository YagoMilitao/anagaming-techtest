import { fetchOddById } from "@/app/lib/fetchOdds";
import OddsDetailPageContent from "@/features/odds/details/OddsDetailPageContent";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { sport: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, sport } = params;
  const { data: odd, error } = await fetchOddById(sport, id);

  if (!odd || error) {
    return {
      title: "Evento Esportivo Não Encontrado | Anagaming",
      description: "O evento esportivo que você procura não foi encontrado ou está indisponível.",
      robots: { index: false, follow: false },
    };
  }

  const eventTitle = `${odd.home_team} vs ${odd.away_team}`;
  const formattedSportName = sport.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() 
                              + word.slice(1)).join(' ');

  return {
    title: `${eventTitle} - Odds de ${formattedSportName} | Anagaming`,
    description: `Acompanhe as odds ao vivo e informações detalhadas para o jogo de ${formattedSportName}: 
                    ${eventTitle}. Veja as melhores cotações e prepare suas apostas.`,
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
      url: `https://anagaming-techtest.vercel.app/sports/${sport}/${id}`,
      images: [
        {
          url: "https://anagaming-techtest.vercel.app/images/logo.jpg",
          width: 1200,
          height: 630,
          alt: `${eventTitle} Odds`,
        },
      ],
      type: "website",
    },
   
  };
}

export default async function OddDetailsPage({ params }: Props) {
  const { sport, id } = params;
  const { data: odd, error } = await fetchOddById(sport, id);

  if (!odd || error) {
    notFound();
  }

  return <OddsDetailPageContent odd={odd} error={error} />;
}