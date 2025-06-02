import "./globals.css";
import Link from "next/link";
import { OddsProvider } from "@/features/odds/context/OddsContext";
import { getSportGroups } from "@/features/odds/services/oddsService";
import { SportGroup } from "@/data/Odd";

async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialSports: SportGroup[] = [];
  try {
    initialSports = await getSportGroups();
  } catch (error) {
    console.error("Failed to load initial sports for OddsProvider:", error);
  }

  return (
    <html lang="en">
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
