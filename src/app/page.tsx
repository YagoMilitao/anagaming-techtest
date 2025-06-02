import { fetchOddsData } from "@/app/lib/fetchOdds";
import ClientHomePage from "@/app/components/ClientHomePage";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { Odd } from "@/data/Odd";
import { authOptions } from "@/app/lib/authOptions";

export default async function HomePage() {
  const session: Session | null = await getServerSession(authOptions);

  let initialOdds: Odd[] = [];
  let displayErrorMessage: string | null = null;
  const fetchResult = await fetchOddsData();

  if (fetchResult.error) {
    switch (fetchResult.error) {
      case "QUOTA_EXCEEDED":
        displayErrorMessage =
          "Parece que excedemos nossa cota de uso da API de odds. Os dados podem não estar atualizados ou disponíveis no momento. Por favor, tente novamente mais tarde ou entre em contato com o suporte.";
        break;
      case "API_KEY_MISSING":
        displayErrorMessage =
          "Erro interno: A chave da API de odds não está configurada corretamente. Favor contatar o administrador.";
        break;
      case "INVALID_DATA_FORMAT":
        displayErrorMessage = "Ocorreu um problema ao processar os dados das apostas. Tente novamente.";
        break;
      case "UNKNOWN_ERROR":
      default:
        displayErrorMessage =
          "Não foi possível carregar os dados das apostas. Verifique sua conexão com a internet ou tente novamente mais tarde.";
        break;
    }
    initialOdds = [];
  } else {
    initialOdds = fetchResult.data;
  }

  if (initialOdds.length === 0 && !displayErrorMessage) {
    displayErrorMessage = "Nenhum evento de aposta disponível no momento. Volte mais tarde!";
  }

  return (
    <ClientHomePage
      initialOdds={initialOdds}
      session={session}
      serverRenderedTimestamp={Date.now()}
      errorMessage={displayErrorMessage}
    />
  );
}
