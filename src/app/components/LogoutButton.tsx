'use client';

import { signOut  } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Sair 
    </button>
  );
}
