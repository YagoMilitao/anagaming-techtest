import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchOddsData } from "@/app/lib/fetchOdds";
import OddDetails from "@/app/sports/[sport]/[id]/page";



export default async function OddsDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const odds = await fetchOddsData();
  // Replace 'OddType' with the actual type of your odds objects if you have one
  const odd = odds.find((o: any) => o.id === params.id);

  if (!odd) {
    return <div className="p-6">Odd não encontrada...</div>;
  }

  return <OddDetails  />;
}
