"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";

export default function UserPanel({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-lg">
        Bem-vindo, <strong>{session?.user?.name}</strong>
      </p>
      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
}
