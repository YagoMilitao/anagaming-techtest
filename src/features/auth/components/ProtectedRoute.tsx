"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import OddsSkeleton from "@/app/components/OddsSkeleton";
// **CORRIGIDO O CAMINHO DE IMPORTAÇÃO**

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: _session, status } = useSession(); // É bom desestruturar 'data' para acesso futuro se necessário
  const pathname = usePathname();

  useEffect(() => {
    // Se o status for 'unauthenticated', redireciona para a página de login.
    // O 'callbackUrl' garante que o usuário seja redirecionado de volta para a rota original
    // após o login bem-sucedido.
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: pathname });
    }
  }, [status, pathname]); // Dependências garantem que o efeito é re-executado quando o status ou path mudam

  // Exibe um skeleton enquanto o status da sessão está sendo carregado.
  // Isso evita um flash de conteúdo ou redirecionamento indesejado antes do status ser definido.
  if (status === "loading") {
    return <OddsSkeleton />; // Use OddsSkeleton ou um skeleton mais genérico
  }

  // Se o usuário está autenticado, renderiza o conteúdo protegido.
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Se o status é 'unauthenticated' (e o useEffect já disparou o signIn) ou
  // se por algum motivo não se encaixa nas condições acima (e não é loading),
  // retorna null para não renderizar nada. O signIn já cuidou do redirecionamento.
  return null;
}
