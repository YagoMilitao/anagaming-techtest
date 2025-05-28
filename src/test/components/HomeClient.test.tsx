import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeClient from '../../../app/components/HomeClient';
import { useSession } from 'next-auth/react';

// Mock next-auth's useSession
jest.mock('next-auth/react');

const mockedUseSession = useSession as jest.Mock;

jest.mock('../../../app/components/LoginButton', () => () => (
    <div data-testid="login-button">LoginButton</div>
));

describe('HomeClient', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state', () => {
        mockedUseSession.mockReturnValue({ data: null, status: 'loading' });
        render(<HomeClient />);
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('renders welcome message when session exists', () => {
        mockedUseSession.mockReturnValue({
            data: { user: { name: 'John Doe' } },
            status: 'authenticated',
        });
        render(<HomeClient />);
        expect(screen.getByText('Bem-vindo, John Doe!')).toBeInTheDocument();
    });

    it('renders LoginButton when no session', () => {
        mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
        render(<HomeClient />);
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
});