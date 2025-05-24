import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <main className="p-8">
      <h1>Área privada</h1>
      <p>Bem-vindo, {session.user?.name}!</p>
    </main>
  );
}
