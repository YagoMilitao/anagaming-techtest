import React from 'react';
import { render } from '@testing-library/react';
import SessionProviderWrapper from '@/app/components/Session/SessionProviderWrapper';


jest.mock('next-auth/react', () => ({
    SessionProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-session-provider">{children}</div>
    ),
}));

describe('SessionProviderWrapper', () => {
    it('renders children inside SessionProvider', () => {
        const { getByTestId, getByText } = render(
            <SessionProviderWrapper>
                <span>Test Child</span>
            </SessionProviderWrapper>
        );
        expect(getByTestId('mock-session-provider')).toBeInTheDocument();
        expect(getByText('Test Child')).toBeInTheDocument();
    });
});