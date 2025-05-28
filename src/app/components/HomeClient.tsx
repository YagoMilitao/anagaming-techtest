'use client';

import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';
import OddsSkeleton from './OddsSkeleton';

export default function HomeClient() {
  const { data: session, status } = useSession();
  if (status === 'loading' ) {
      return <OddsSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {session ? (
        <>
          <p className="text-xl">Bem-vindo, {session.user?.name}!</p>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
