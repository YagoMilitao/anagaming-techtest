import './globals.css';
import Link from "next/link";
import { OddsProvider } from "./context/OddsContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OddsProvider>
           <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
             <h1 className="text-xl font-bold">
              <Link href="/">
                Ana Gaming
              </Link>
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
