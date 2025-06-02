// src/app/sports/[sport]/[id]/page.tsx
// Este é o Server Component da rota dinâmica.
import { fetchOddById } from "@/app/lib/fetchOdds";
import OddsDetailPageContent from "@/features/odds/details/OddsDetailPageContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OddDetailsPage({ params }: any) {
  // <<< MUDANÇA AQUI: `any`
  // Embora 'params' seja 'any', ainda é boa prática desestruturar
  // e tratar os tipos internamente, pois o TypeScript irá inferir
  // 'sport' e 'id' como 'any' se você não tipá-los.
  // Você pode usar uma asserção de tipo aqui se quiser mais segurança:
  const { sport, id } = params as { sport: string; id: string };
  // Ou simplesmente:
  // const { sport, id } = params

  const { data: odd, error } = await fetchOddById(sport, id);

  return <OddsDetailPageContent odd={odd} error={error} />;
}
