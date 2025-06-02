import { notFound } from "next/navigation";
import { getOddDetails } from "@/features/odds/services/oddsService";
import { OddDetailsDisplay } from "@/features/odds/components/OddDetailsDisplay";

interface OddDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OddDetailPage({ params }: OddDetailPageProps) {
  const { id } = params;

  let oddData;
  try {
    oddData = await getOddDetails(id);
  } catch (error) {
    console.error("Erro ao buscar dados da odd no Server Component:", error);
    throw error;
  }

  if (!oddData) {
    notFound();
  }

  return <OddDetailsDisplay odd={oddData} />;
}
