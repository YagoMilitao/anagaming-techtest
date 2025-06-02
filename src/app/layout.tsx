// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { OddsProvider } from "@/features/odds/context/OddsContext";
import { getSportGroups } from "@/features/odds/services/oddsService";
import { SportGroup } from "@/data/Odd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Anagaming - Acompanhe as Melhores Odds em Tempo Real",
    template: "%s | Anagaming",
  },
  description: "Acompanhe as melhores odds e resultados de apostas esportivas em tempo real. Futebol, Basquete, e-Sports e mais. Sua plataforma para apostas inteligentes.",
  keywords: ["odds ao vivo", "apostas esportivas", "prognósticos", "resultados esportivos", "futebol", "basquete", "e-sports", "apostas online", "anagaming"],
  authors: [{ name: "Yago Militão" }],
  creator: "Yago Militão",
  publisher: "Anagaming",
  applicationName: "AnagamingBets",
  openGraph: {
    title: "Anagaming - Acompanhe as Melhores Odds em Tempo Real",
    description: "Sua plataforma para apostas inteligentes. Odds de futebol, basquete, e-Sports e muito mais, tudo em tempo real.",
    url: "https://anagaming-techtest.vercel.app/",
    siteName: "Anagaming",
    images: [
      {
        url: "https://anagaming-techtest.vercel.app/images/logo.jpg", // Crie esta imagem (ex: 1200x630px) na pasta public/images/
        width: 1200,
        height: 630,
        alt: "Anagaming - Melhores Odds Esportivas",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Anagaming - Acompanhe as Melhores Odds em Tempo Real",
    description: "Odds ao vivo para futebol, basquete, e-Sports. Análise de apostas e resultados em tempo real. #ApostasEsportivas #OddsAoVivo",
    site: "@yagolis", 
    creator: "@yagolis",
    images: "https://anagaming-techtest.vercel.app/images/logo-black.png",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialSports: SportGroup[] = [];
  try {
    initialSports = await getSportGroups();
  } catch (error) {
    console.error("Failed to load initial sports for OddsProvider:", error);
  }

  return (
    <html lang="pt-BR">
      <body>
        <OddsProvider initialSports={initialSports}>
          <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/">Ana Gaming</Link>
            </h1>
            <nav className="space-x-4">
              <Link href="/api/auth/signout">Logout</Link>
            </nav>
          </header>
          {children}
        </OddsProvider>
      </body>
    </html>
  );
}

export default RootLayout;