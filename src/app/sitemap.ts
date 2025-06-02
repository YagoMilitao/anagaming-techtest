import { MetadataRoute } from "next";
import { fetchOddsData } from "@/app/lib/fetchOdds";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anagaming-techtest.vercel.app";

  const staticPages = [{ url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 }];

  const fetchResult = await fetchOddsData();
  const odds = fetchResult.data || [];
  const dynamicEventPages = odds.map((odd) => {
    const formattedSportKey = odd.sport_key.replace(/_/g, "-");
    return {
      url: `${baseUrl}/sports/${formattedSportKey}/${odd.id}`,
      lastModified: new Date(odd.commence_time),
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const uniqueSportKeys = [...new Set(odds.map((odd) => odd.sport_key))];
  const dynamicSportPages = uniqueSportKeys.map((sportKey) => ({
    url: `${baseUrl}/sports/${sportKey.replace(/_/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...dynamicSportPages, ...dynamicEventPages];
}
