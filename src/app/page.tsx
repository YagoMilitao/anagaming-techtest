import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientHomePage from "./components/ClientHomePage";
import { FilterProvider } from "./context/FilterContext";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <FilterProvider>
      <ClientHomePage session={session} />
    </FilterProvider>
  )
}
