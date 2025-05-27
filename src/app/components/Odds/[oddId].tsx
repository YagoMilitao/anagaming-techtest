import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface OddDetails {
  id: string;
  eventName: string;
  marketName: string;
  outcomeName: string;
  oddValue: number;
  // Adicione aqui outros campos relevantes da sua odd
}

const SpecificOddPage: React.FC = () => {
  const router = useRouter();
  const { oddId } = router.query;
  const [oddDetails, setOddDetails] = useState<OddDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (oddId) {
      // Simulação de uma chamada à API para buscar os detalhes da odd
      // Em um cenário real, você faria uma requisição para o seu backend
      fetchOddDetails(oddId as string)
        .then((data) => {
          setOddDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Erro ao buscar detalhes da odd.');
          setLoading(false);
          console.error(err);
        });
    }
  }, [oddId]);

  // Função simulada para buscar os detalhes da odd (substitua pela sua lógica real)
  const fetchOddDetails = async (id: string): Promise<OddDetails> => {
    // Simulação de dados de uma odd específica
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          eventName: `Jogo Exemplo ${id}`,
          marketName: 'Resultado Final',
          outcomeName: 'Vitória Time A',
          oddValue: parseFloat((1.85 + Math.random() * 0.5).toFixed(2)),
          // Adicione aqui mais dados simulados conforme a sua necessidade
        });
      }, 500); // Simula um pequeno delay de rede
    });
  };

  if (loading) {
    return <div>Carregando detalhes da odd...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!oddDetails) {
    return <div>Odd não encontrada.</div>;
  }

  return (
    <div>
      <h1>Detalhes da Odd</h1>
      <p><strong>ID da Odd:</strong> {oddDetails.id}</p>
      <p><strong>Evento:</strong> {oddDetails.eventName}</p>
      <p><strong>Mercado:</strong> {oddDetails.marketName}</p>
      <p><strong>Resultado:</strong> {oddDetails.outcomeName}</p>
      <p><strong>Odd:</strong> {oddDetails.oddValue}</p>
      {/* Exiba aqui outros detalhes relevantes da odd */}
    </div>
  );
};

export default SpecificOddPage;