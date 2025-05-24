'use client';

import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

export default function HomeClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Carregando...</p>;

  return (
     <div>
      {session ? (
        <>
          <p>Bem-vindo, {session.user?.name}</p>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
