 import './globals.css';
// import { Providers } from './providers';
// import Link from 'next/link';

import Link from "next/link";
import { OddsProvider } from "./context/OddsContext";
import { FilterProvider } from './context/FilterContext';

// export const metadata = {
//   title: 'Ana Gaming Techtest',
//   description: 'Teste técnico Ana Gaming',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="pt-BR">
//       <body>
//         <Providers>
//           <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
//             <h1 className="text-xl font-bold">Ana Gaming</h1>
//             <nav className="space-x-4">
//               <Link href="/">Home</Link>
//               <Link href="/dashboard">Dashboard</Link>
//               <Link href="/api/auth/signout">Logout</Link>
//             </nav>
//           </header>
//           <main className="p-4">{children}</main>
//         </Providers>
//       </body>
//     </html>
//   );
// }


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OddsProvider>
           <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
             <h1 className="text-xl font-bold">Ana Gaming</h1>
             <nav className="space-x-4">
               <Link href="/">Home</Link>
               <Link href="/dashboard">Dashboard</Link>
               <Link href="/api/auth/signout">Logout</Link>
             </nav>
           </header>
           {children}
        </OddsProvider>
      </body>
    </html>
  );
}
