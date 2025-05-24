'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomeClient() {
  const { data: session } = useSession();

  return (
    <main className="p-8">
      {session ? (
        <>
          <p>Bem-vindo, {session.user?.name}!</p>
          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </>
      ) : (
        <>
          <p>Você não está logado.</p>
          <button
            onClick={() => signIn("github")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Entrar com GitHub
          </button>
        </>
      )}
    </main>
  );
}
