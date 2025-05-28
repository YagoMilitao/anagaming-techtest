"use client"

import { Session } from "next-auth"

export default function UserPanel({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-lg">
        Bem-vindo, <strong>{session?.user?.name}</strong>
      </p>
    </div>
  )
}
