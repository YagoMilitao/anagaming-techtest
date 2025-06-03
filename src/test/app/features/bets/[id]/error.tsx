import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OddDetailsError from '@/features/bets/[id]/error';


describe('OddDetailsError', () => {
  // Mock da função console.error para capturar seus chamados
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    // Restaura a implementação original de console.error após todos os testes
    consoleErrorSpy.mockRestore();
  });

  it('should display the generic error message by default', () => {
    const mockError = new Error('Some unexpected error occurred');
    const mockReset = jest.fn();

    render(<OddDetailsError error={mockError} reset={mockReset} />);

    // Verifica se o título da mensagem de erro está presente
    expect(screen.getByText('Ops! Algo deu errado ao carregar a odd.')).toBeInTheDocument();
    // Verifica se a mensagem de erro específica do objeto Error é exibida
    expect(screen.getByText('Some unexpected error occurred')).toBeInTheDocument();
    // Verifica se o botão "Tentar Novamente" está presente
    expect(screen.getByRole('button', { name: /Tentar Novamente/i })).toBeInTheDocument();
    // Verifica se o erro foi logado no console
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in Odd Details Page:', mockError);
  });

  it('should display the fallback message if error.message is empty', () => {
    const mockError = new Error(''); // Mensagem vazia
    const mockReset = jest.fn();

    render(<OddDetailsError error={mockError} reset={mockReset} />);

    // Verifica se a mensagem de fallback é exibida
    expect(screen.getByText('Houve um problema inesperado. Por favor, tente novamente.')).toBeInTheDocument();
    // Garante que a mensagem vazia do erro original não é exibida
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });

  it('should call the reset function when "Tentar Novamente" button is clicked', () => {
    const mockError = new Error('Test error');
    const mockReset = jest.fn(); // Função mockada para simular o reset

    render(<OddDetailsError error={mockError} reset={mockReset} />);

    const resetButton = screen.getByRole('button', { name: /Tentar Novamente/i });
    fireEvent.click(resetButton); // Simula o clique no botão

    // Verifica se a função reset foi chamada
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should apply correct styling classes to elements', () => {
    const mockError = new Error('Styling test');
    const mockReset = jest.fn();

    render(<OddDetailsError error={mockError} reset={mockReset} />);

    // Verifica se o container principal tem as classes de estilo esperadas
    const container = screen.getByText('Ops! Algo deu errado ao carregar a odd.').closest('div');
    expect(container).toHaveClass('p-6');
    expect(container).toHaveClass('bg-red-50');
    expect(container).toHaveClass('border-red-200');

    // Verifica se o botão tem as classes de estilo esperadas
    const resetButton = screen.getByRole('button', { name: /Tentar Novamente/i });
    expect(resetButton).toHaveClass('bg-blue-600');
    expect(resetButton).toHaveClass('text-white');
  });
});