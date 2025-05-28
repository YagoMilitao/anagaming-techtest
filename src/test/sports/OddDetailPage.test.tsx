import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { useParams } from 'next/navigation';
import { OddDetailPageState } from '@/state/OddDetailPageState';
import { OddDetailPageViewModel } from '@/app/viewmodels/OddDetailPageViewModel';
import OddDetailPage from '@/app/bets/[id]/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaCalendarAlt: () => <span data-testid="calendar-icon" />,
    FaClock: () => <span data-testid="clock-icon" />,
    FaTrophy: () => <span data-testid="trophy-icon" />,
}));

// Mock OddDetailPageState and OddDetailPageViewModel
jest.mock('@/state/OddDetailPageState');
jest.mock('@/app/viewmodels/OddDetailPageViewModel');

const mockUseParams = useParams as jest.Mock;

describe('OddDetailPage', () => {
    let mockState: any;
    let mockLoadOddDetails: jest.Mock;
    let mockGetDisplayData: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseParams.mockReturnValue({ sport: 'soccer', id: '123' });

        mockLoadOddDetails = jest.fn();
        mockState = { loadOddDetails: mockLoadOddDetails };
        (OddDetailPageState as jest.Mock).mockImplementation(() => mockState);

        mockGetDisplayData = jest.fn();
        (OddDetailPageViewModel as jest.Mock).mockImplementation(() => ({
            getDisplayData: mockGetDisplayData,
        }));
    });

    it('renders loading state', () => {
        mockGetDisplayData.mockReturnValue({
            isLoading: true,
            hasError: false,
            oddFound: true,
        });

        render(<OddDetailPage />);
        expect(screen.getByText(/Carregando detalhes da odd/i)).toBeInTheDocument();
    });

    it('renders error state and retry button', () => {
        mockGetDisplayData.mockReturnValue({
            isLoading: false,
            hasError: true,
            errorMessage: 'Erro de teste',
            oddFound: true,
        });

        render(<OddDetailPage />);
        expect(screen.getByText(/Erro: Erro de teste/i)).toBeInTheDocument();
        const retryButton = screen.getByRole('button', { name: /Tentar Novamente/i });
        expect(retryButton).toBeInTheDocument();

        fireEvent.click(retryButton);
        expect(mockLoadOddDetails).toHaveBeenCalled();
    });

    it('renders error state with default message', () => {
        mockGetDisplayData.mockReturnValue({
            isLoading: false,
            hasError: true,
            errorMessage: '',
            oddFound: true,
        });

        render(<OddDetailPage />);
        expect(
            screen.getByText(/Ocorreu um erro ao carregar os detalhes da odd/i)
        ).toBeInTheDocument();
    });

    it('renders not found state', () => {
        mockGetDisplayData.mockReturnValue({
            isLoading: false,
            hasError: false,
            oddFound: false,
        });

        render(<OddDetailPage />);
        expect(screen.getByText(/Odd não encontrada/i)).toBeInTheDocument();
    });

    it('renders odd details', () => {
        mockGetDisplayData.mockReturnValue({
            isLoading: false,
            hasError: false,
            oddFound: true,
            homeTeam: 'Team A',
            awayTeam: 'Team B',
            leagueName: 'Premier League',
            formattedDate: '01/01/2024',
            formattedTime: '20:00',
            bookmakers: [
                {
                    key: 'bm1',
                    title: 'Bookmaker 1',
                    markets: [
                        {
                            key: 'h2h',
                            outcomes: [
                                { name: 'Team A', price: 1.5 },
                                { name: 'Team B', price: 2.5 },
                            ],
                        },
                    ],
                },
            ],
        });

        render(<OddDetailPage />);
        expect(screen.getByText(/Team A vs Team B/i)).toBeInTheDocument();
        expect(screen.getByText(/Premier League/i)).toBeInTheDocument();
        expect(screen.getByText(/01\/01\/2024/i)).toBeInTheDocument();
        expect(screen.getByText(/20:00/i)).toBeInTheDocument();
        expect(screen.getByText(/Odds/i)).toBeInTheDocument();
        expect(screen.getByText(/Bookmaker 1/i)).toBeInTheDocument();
        expect(screen.getByText(/H2H:/i)).toBeInTheDocument();
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
        expect(screen.getByText(/1.50/i)).toBeInTheDocument();
        expect(screen.getByText(/Team B/i)).toBeInTheDocument();
        expect(screen.getByText(/2.50/i)).toBeInTheDocument();
    });
});