import { notFound } from "next/navigation";
import { getOddDetails } from "@/features/odds/services/oddsService"; // Importe o serviço de busca de dados
import { OddDetailsDisplay } from "@/features/odds/components/OddDetailsDisplay"; // Importe o componente de UI

interface OddDetailPageProps {
  params: {
    id: string; // O ID da odd será passado via props
  };
}

export default async function OddDetailPage({ params }: OddDetailPageProps) {
  const { id } = params;

  let oddData;
  try {
    oddData = await getOddDetails(id); // Chamada direta ao serviço do servidor
  } catch (error) {
    // Erros de busca de dados serão capturados pelo error.tsx
    console.error("Erro ao buscar dados da odd no Server Component:", error);
    throw error; // Propagar o erro para o error.tsx
  }

  if (!oddData) {
    // Se a odd não for encontrada (ex: API retornou null ou 404), use notFound() do Next.js
    notFound();
  }

  // Passa os dados para o Client Component de exibição
  return <OddDetailsDisplay odd={oddData} />;
}
