// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OddsList from "./components/Odds/OddsList";
import { fetchOddsData } from "./lib/fetchOdds";
import UserPanel from "./components/UserPanel";
import FilterBar from "./components/FilterBar";
import OddsFilter from "./components/Odds/OddsFilter";


export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const odds = await fetchOddsData();
  type Odd = { sport_title: string; [key: string]: any };
  const sports: string[] = Array.from(new Set(odds.map((o: Odd) => o.sport_title)));


  return (
    <main className="p-6">
      <UserPanel session={session} />
      <h1 className="text-2xl font-bold my-4">
        Apostas ao Vivo
      </h1>
      <FilterBar sports={sports} />
      <OddsFilter />
      <OddsList odds={odds} />
    </main>
  );
}
