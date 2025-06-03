import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OddsSkeleton from '@/app/components/OddsSkeleton';

// Mock do componente 'motion' do framer-motion
// Isso evita que o Jest tente renderizar a lógica interna do framer-motion,
// focando apenas na estrutura e nas props que seriam passadas.
jest.mock('framer-motion', () => ({
  motion: {
    li: ({ children, variants, animate, className, ...props }: any) => (
      <li
        data-testid="skeleton-item"
        data-variants={JSON.stringify(variants)}
        data-animate={animate}
        className={className}
        {...props}
      >
        {children}
      </li>
    ),
  },
}));

describe('OddsSkeleton', () => {
  it('should render 5 skeleton items', () => {
    render(<OddsSkeleton />);

    // Verifica se existem 5 itens de esqueleto (baseado no data-testid do mock)
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems).toHaveLength(5);
  });

  it('should apply the correct classes and attributes to each skeleton item', () => {
    render(<OddsSkeleton />); // Renderiza 5, mas pegamos o primeiro para inspeção

    const skeletonItem = screen.getAllByTestId('skeleton-item')[0]; // Pega o primeiro item
    expect(skeletonItem).toBeInTheDocument();

    // Verifica classes CSS (indicando a estrutura visual)
    expect(skeletonItem).toHaveClass('bg-white');
    expect(skeletonItem).toHaveClass('rounded-xl');
    expect(skeletonItem).toHaveClass('shadow-md');
    expect(skeletonItem).toHaveClass('p-5');
    expect(skeletonItem).toHaveClass('border');
    expect(skeletonItem).toHaveClass('border-gray-200');

    // Verifica se as propriedades de animação do framer-motion foram passadas ao mock
    expect(skeletonItem).toHaveAttribute('data-animate', 'pulse');
    const variants = JSON.parse(skeletonItem.getAttribute('data-variants') || '{}');
    expect(variants).toEqual({
      pulse: {
        opacity: [0.4, 1, 0.4],
        transition: {
          duration: 1.5,
          repeat: Infinity,
        },
      },
    });

    // Verifica a presença de divs internas que simulam o conteúdo
    expect(skeletonItem.querySelector('.h-4.w-24.bg-gray-300')).toBeInTheDocument();
    expect(skeletonItem.querySelector('.h-5.w-3/4.bg-gray-300')).toBeInTheDocument();
    expect(skeletonItem.querySelector('.grid.grid-cols-1')).toBeInTheDocument();
  });

  it('should have the correct classes on the ul wrapper', () => {
    render(<OddsSkeleton />);
    const ulElement = screen.getByRole('list'); // A lista não tem um testid, então usamos role

    expect(ulElement).toHaveClass('space-y-4');
    expect(ulElement).toHaveClass('mt-3');
    expect(ulElement).toHaveClass('p-6');
    expect(ulElement).toHaveClass('max-w-5xl');
    expect(ulElement).toHaveClass('mx-auto');
  });
});