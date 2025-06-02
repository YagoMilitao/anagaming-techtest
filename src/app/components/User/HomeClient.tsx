"use client";

import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton"; // Permanece relativo, pois está na mesma pasta
import UserPanel from "./UserPanel"; // Permanece relativo, pois está na mesma pasta
import OddsSkeleton from "../OddsSkeleton";

function HomeClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <OddsSkeleton />; // Exibe o skeleton enquanto a sessão carrega
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {session ? (
        // Se autenticado, renderiza o UserPanel
        <UserPanel session={session} />
      ) : (
        // Se não autenticado, mostra o botão de login
        <LoginButton />
      )}
    </div>
  );
}
export default HomeClient;
