"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import OddsSkeleton from "@/app/components/OddsSkeleton";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: _session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: pathname });
    }
  }, [status, pathname]);
  
  if (status === "loading") {
    return <OddsSkeleton />;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}
