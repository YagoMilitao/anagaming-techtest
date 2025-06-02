"use client";

import { Session } from "next-auth";

interface UserPanelProps {
  session: Session | null;
  children?: React.ReactNode;
}

function UserPanel({ session, children }: UserPanelProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-lg">
        Bem-vindo, <strong>{session?.user?.name || "Usuário"}</strong> {/* Adicionado fallback 'Usuário' */}
      </p>
      {children}
    </div>
  );
}
export default UserPanel;
