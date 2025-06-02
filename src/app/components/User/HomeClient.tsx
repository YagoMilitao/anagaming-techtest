"use client";

import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton"; 
import UserPanel from "./UserPanel"; 
import OddsSkeleton from "../OddsSkeleton";

function HomeClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <OddsSkeleton />; 
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {session ? (
        <UserPanel session={session} />
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
export default HomeClient;
