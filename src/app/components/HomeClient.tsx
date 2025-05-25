'use client';

import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Link from 'next/link';

export default function HomeClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {session ? (
        <>
          <p className="text-xl">Bem-vindo, {session.user?.name}!</p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Ir para o Dashboard
              </button>
            </Link>
            <LogoutButton />
          </div>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
