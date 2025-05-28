import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientHomePage from "./components/ClientHomePage";
import { FilterProvider } from "./context/FilterContext";
import { authOptions } from "@/lib/authOptions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <FilterProvider>
      <ClientHomePage session={session} />
    </FilterProvider>
  )
}
