import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">Painel do Usuário</h1>
        <p className="text-lg">Você está autenticado e pode ver esta página!</p>
      </div>
    </ProtectedRoute>
  );
}