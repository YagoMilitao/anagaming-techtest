import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Odd } from '@/data/Odd';
import { OddDetailsDisplay } from '@/features/odds/components/OddDetailsDisplay';

describe('OddDetailsDisplay', () => {
  const mockOdd: Odd = {
    id: 'test-odd-1',
    sport_key: 'soccer_epl',
    sport_title: 'Futebol',
    // Usar um timestamp para facilitar a consistência em testes
    // Esta data é 15 de junho de 2025, 15:30:00 UTC
    commence_time: '2025-06-15T15:30:00Z',
    home_team: 'Corinthians',
    away_team: 'Palmeiras',
    league_name: 'Campeonato Brasileiro',
    bookmakers: [
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: '2025-06-15T15:20:00Z',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Corinthians', price: 2.15 },
              { name: 'Draw', price: 3.20 },
              { name: 'Palmeiras', price: 3.50 },
            ],
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over 2.5', price: 1.80 },
              { name: 'Under 2.5', price: 2.05 },
            ],
          },
        ],
      },
      {
        key: 'betway',
        title: 'Betway',
        last_update: '2025-06-15T15:25:00Z',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Corinthians', price: 2.10 },
              { name: 'Draw', price: 3.30 },
              { name: 'Palmeiras', price: 3.40 },
            ],
          },
        ],
      },
    ],
  };

  // =========================================================================
  // REMOVEMOS O MOCK DETALHADO DE global.Date E Date.prototype AQUI
  // Deixaremos o JSDOM usar sua própria implementação de Date.
  // Se houver problemas com o locale, teremos que ajustar as strings esperadas
  // ou usar uma biblioteca de formatação consistente para ambos (componente e teste).
  // =========================================================================

  it('should display home and away team names', () => {
    render(<OddDetailsDisplay odd={mockOdd} />);
    expect(screen.getByText('Corinthians vs Palmeiras')).toBeInTheDocument();
  });

  it('should display sport title and league name', () => {
    render(<OddDetailsDisplay odd={mockOdd} />);
    expect(screen.getByText('Futebol - Campeonato Brasileiro')).toBeInTheDocument();
  });

  it('should display "Nome Indisponivel" if league_name is not provided', () => {
    const oddWithoutLeague = { ...mockOdd, league_name: undefined };
    render(<OddDetailsDisplay odd={oddWithoutLeague} />);
    expect(screen.getByText('Futebol - Nome Indisponivel')).toBeInTheDocument();
  });

  it('should display formatted commence date and time', () => {
    // Para este teste, o mais seguro é definir um locale fixo para o ambiente de teste
    // ou simplesmente verificar que o formato esperado aparece.
    // O JSDOM (ambiente de teste do Jest) geralmente usa o locale padrão do Node.js,
    // que pode não ser 'pt-BR'.
    // Se o teste falhar aqui, você pode:
    // 1. Instalar 'moment' ou 'date-fns' no projeto e usar para formatar no componente e no teste.
    // 2. Mockar o `Intl.DateTimeFormat` (mais complexo).
    // 3. Simplesmente verificar que o texto contém partes da data e hora, sem ser super específico com o locale.

    // A saída esperada para '2025-06-15T15:30:00Z' em um ambiente 'en-US' (padrão em muitos JSDOM) seria:
    // Data: "6/15/2025" ou "June 15, 2025"
    // Hora: "3:30:00 PM" ou "15:30:00" (se for formatado para 24h)

    // Dada a sua localização (Brasil), você provavelmente quer 'pt-BR'.
    // Uma forma de verificar isso sem mockar Date.prototype é se certificar
    // de que seu ambiente Jest está configurado para 'pt-BR' ou ser menos específico.

    // Para o propósito deste teste, vamos ASSUMIR que a saída será '15/06/2025' e '15:30:00'
    // com base no que você tinha no mock anterior. Se o teste falhar, verifique a saída real
    // do `toLocaleDateString()` e `toLocaleTimeString()` no seu ambiente de teste.

    // Podemos usar um Regex ou `getByText` direto se a string for exata.
    // Visto que o `commence_time` é '2025-06-15T15:30:00Z' (UTC), e no Brasil é GMT-03:00,
    // a hora local seria 12:30 PM (ou 12:30:00).
    // Se você quer 15:30:00, precisa ter certeza que o `commence_time` já está no fuso horário local,
    // ou que a formatação ignora o fuso horário (o que geralmente não acontece com toLocaleTimeString).

    // Vamos ajustar o mockOdd.commence_time para ser mais consistente com a saída "15:30:00"
    // Se a intenção é exibir a hora exata da string (ignorar fuso), você pode precisar de uma lib.
    // Se for local, a hora 15:30:00 UTC será 12:30:00 no Brasil.

    // Vamos testar com o comportamento padrão do toLocaleString, que é locale-dependent.
    // Por exemplo, para um ambiente en-US: '6/15/2025' e '3:30:00 PM'
    // Para um ambiente pt-BR: '15/06/2025' e '12:30:00' (se fosse 15:30 UTC -> 12:30 GMT-3)
    // Se a saída '15:30:00' é crucial, precisamos ajustar o mock.

    // NO ENTANTO, o erro original era sobre `toLocaleDateString` não existir.
    // Removendo o mock de Date.prototype resolve isso.
    // O próximo passo é verificar a string real que é renderizada no seu ambiente.

    render(<OddDetailsDisplay odd={mockOdd} />);

    // Você precisará ajustar estas strings esperadas com base no locale do seu ambiente Jest/Node.
    // Uma forma de debugar é adicionar um console.log na linha do componente:
    // console.log(new Date(odd.commence_time).toLocaleDateString());
    // console.log(new Date(odd.commence_time).toLocaleTimeString());
    // E rodar o teste para ver o que ele imprime.

    // Por exemplo, para o locale 'pt-BR' e '2025-06-15T15:30:00Z' (UTC):
    // Data: '15/06/2025'
    // Hora: '12:30:00' (GMT-03:00)

    // Se você *precisa* da saída '15:30:00' no horário local, o commence_time teria que ser
    // '2025-06-15T18:30:00Z' (UTC) para se tornar 15:30:00 localmente no Brasil.
    // Ou, para simplificar o teste, podemos verificar que o `commence_time` *contém* as partes da data/hora
    // que esperamos, mas sem ser super específico com o formato exato que muda com locale.

    // Vamos tentar com o formato que provavelmente se espera no seu ambiente (se for pt-BR)
    expect(screen.getByText('15/06/2025')).toBeInTheDocument();
    // A hora UTC 15:30:00Z é 12:30:00 no fuso horário -03:00 (Brasil)
    expect(screen.getByText('12:30:00')).toBeInTheDocument(); // Ajustado para o fuso horário -03:00
  });

  it('should display all bookmakers and their titles', () => {
    render(<OddDetailsDisplay odd={mockOdd} />);
    expect(screen.getByText('Bet365')).toBeInTheDocument();
    expect(screen.getByText('Betway')).toBeInTheDocument();
  });

  it('should render the correct number of bookmakers, markets, and outcomes', () => {
    render(<OddDetailsDisplay odd={mockOdd} />);

    // Check number of bookmakers
    const bookmakers = screen.getAllByRole('heading', { level: 3 }); // h3 for bookmaker titles
    expect(bookmakers).toHaveLength(mockOdd.bookmakers.length);

    // Check number of markets (paragraphs with "Mercado: ")
    const markets = screen.getAllByText(/Mercado:/i);
    expect(markets).toHaveLength(mockOdd.bookmakers[0].markets.length + mockOdd.bookmakers[1].markets.length); // 2 + 1 = 3

    // Check total number of outcomes divs (p-3)
    // We can target elements by their content using regex for prices or by classes
    const outcomePriceElements = screen.getAllByText(/^[0-9]+\.[0-9]{2}$/);
    // Total outcomes: Bet365 h2h (3) + totals (2) + Betway h2h (3) = 8
    expect(outcomePriceElements).toHaveLength(8);
  });
});