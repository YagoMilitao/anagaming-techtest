"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Entrar com GitHub
    </button>
  );
}
