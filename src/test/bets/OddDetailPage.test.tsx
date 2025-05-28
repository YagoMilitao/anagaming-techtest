import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as nextNavigation from 'next/navigation';
import OddDetailPage from '@/app/bets/[id]/page';

// Mock useParams to provide a fake id
jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: 'soccer_epl' });

// Mock fetch
const mockOdd = {
    home_team: 'Team A',
    away_team: 'Team B',
    commence_time: '2024-06-01T15:00:00Z',
    league_name: 'Premier League',
    bookmakers: [
        {
            key: 'bet365',
            markets: [
                {
                    outcomes: [
                        { name: 'Team A', price: 1.5 },
                        { name: 'Team B', price: 2.5 },
                    ],
                },
            ],
        },
    ],
};

describe('OddDetailPage', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockOdd),
        } as any);
    });

    it('renders loading state initially', () => {
        // Delay fetch promise to keep loading state
        (global.fetch as jest.Mock).mockImplementationOnce(
            () => new Promise(() => {})
        );
        render(<OddDetailPage />);
        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    });

    it('renders odd details after fetch', async () => {
        render(<OddDetailPage />);
        await waitFor(() => {
            expect(screen.getByText(/Team A vs Team B/)).toBeInTheDocument();
        });
        expect(screen.getByText(/Premier League/)).toBeInTheDocument();
        expect(screen.getByText(/Odds/)).toBeInTheDocument();
        expect(screen.getByText('bet365')).toBeInTheDocument();
        expect(screen.getByText('Team A')).toBeInTheDocument();
        expect(screen.getByText('1.50')).toBeInTheDocument();
        expect(screen.getByText('Team B')).toBeInTheDocument();
        expect(screen.getByText('2.50')).toBeInTheDocument();
    });

    it('renders not found message if odd is null', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(null),
        });
        render(<OddDetailPage />);
        await waitFor(() => {
            expect(screen.getByText(/Odd não encontrada/i)).toBeInTheDocument();
        });
    });

    it('renders date and time correctly', async () => {
        render(<OddDetailPage />);
        await waitFor(() => {
            expect(screen.getByText(/Team A vs Team B/)).toBeInTheDocument();
        });
        // Date and time formatting depends on locale, so we check for presence
        expect(screen.getByText((content, node) => {
            return node?.tagName.toLowerCase() === 'span' && /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(content);
        })).toBeInTheDocument();
        expect(screen.getByText((content, node) => {
            return node?.tagName.toLowerCase() === 'span' && /\d{1,2}:\d{2}/.test(content);
        })).toBeInTheDocument();
    });

    it('renders ld+json script with correct content', async () => {
        render(<OddDetailPage />);
        await waitFor(() => {
            expect(screen.getByText(/Team A vs Team B/)).toBeInTheDocument();
        });
        const script = document.querySelector('script[type="application/ld+json"]');
        expect(script).toBeInTheDocument();
        const json = JSON.parse(script!.innerHTML);
        expect(json['@type']).toBe('SportsEvent');
        expect(json.name).toBe('Team A vs Team B');
    });
});