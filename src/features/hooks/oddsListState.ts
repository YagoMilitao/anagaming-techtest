"use client";

import { useRouter } from "next/navigation";

export function useOddsListState() {
  const router = useRouter();

  function navigateToDetails(sport_key: string, id: string) {
    router.push(`/sports/${sport_key}/${id}`);
  }

  return {
    navigateToDetails,
  };
}
