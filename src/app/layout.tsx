import "./globals.css";
import Link from "next/link";
import { OddsProvider } from "@/features/odds/context/OddsContext"; // Importe do novo caminho
import { getSportGroups } from "@/features/odds/services/oddsService"; // Importe o serviço do servidor
import { SportGroup } from "@/data/Odd";

async function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Buscar os dados de esportes no servidor
  let initialSports: SportGroup[] = [];
  try {
    initialSports = await getSportGroups();
  } catch (error) {
    // Logar o erro no servidor. No cliente, a interface pode mostrar algo vazio ou um erro genérico.
    console.error("Failed to load initial sports for OddsProvider:", error);
    // Em produção, você pode querer implementar um fallback mais robusto ou
    // um sistema de notificação de erros (ex: Sentry).
  }

  return (
    <html lang="en">
      <body>
        {/* 2. Passar os dados de esportes como prop para o OddsProvider */}
        <OddsProvider initialSports={initialSports}>
          <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/">Ana Gaming</Link>
            </h1>
            <nav className="space-x-4">
              {/* Certifique-se de que /api/auth/signout está configurado com NextAuth.js App Router */}
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
