import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '../../../app/components/LoginButton';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

describe('LoginButton', () => {
    it('renders the button with correct text', () => {
        render(<LoginButton />);
        expect(screen.getByRole('button', { name: /entrar com github/i })).toBeInTheDocument();
    });

    it('calls signIn with correct arguments when clicked', () => {
        render(<LoginButton />);
        const button = screen.getByRole('button', { name: /entrar com github/i });
        fireEvent.click(button);
        expect(signIn).toHaveBeenCalledWith('github', { callbackUrl: '/' });
    });

    it('has the correct class names', () => {
        render(<LoginButton />);
        const button = screen.getByRole('button', { name: /entrar com github/i });
        expect(button).toHaveClass('px-4', 'py-2', 'bg-black', 'text-white', 'rounded', 'hover:bg-gray-800');
    });
});