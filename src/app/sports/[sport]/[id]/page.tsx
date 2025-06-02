import { fetchOddById } from "@/app/lib/fetchOdds";
import OddsDetailPageContent from "@/features/odds/details/OddsDetailPageContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OddDetailsPage({ params }: any) {
  const { sport, id } = params as { sport: string; id: string };
  const { data: odd, error } = await fetchOddById(sport, id);

  return <OddsDetailPageContent odd={odd} error={error} />;
}
