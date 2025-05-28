import React from 'react';
import { render, act } from '@testing-library/react';
import { OddsProvider, useOddsContext } from '../../app/context/OddsContext';

const TestComponent = () => {
    const {
        favoriteSports,
        toggleFavoriteSport,
    } = useOddsContext();

    return (
        <div>
            <span data-testid="favorites">{JSON.stringify(favoriteSports)}</span>
            <button onClick={() => toggleFavoriteSport('soccer')}>Toggle Soccer</button>
            <button onClick={() => toggleFavoriteSport('basketball')}>Toggle Basketball</button>
        </div>
    );
};

describe('OddsContext favoriteSports', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize favoriteSports from localStorage', () => {
        localStorage.setItem('favoriteSports', JSON.stringify(['soccer']));
        let favorites: string[] = [];
        const Wrapper = () => {
            const { favoriteSports } = useOddsContext();
            favorites = favoriteSports;
            return null;
        };
        render(
            <OddsProvider>
                <Wrapper />
            </OddsProvider>
        );
        expect(favorites).toEqual(['soccer']);
    });

    it('should add a sport to favoriteSports', () => {
        const { getByText, getByTestId } = render(
            <OddsProvider>
                <TestComponent />
            </OddsProvider>
        );
        act(() => {
            getByText('Toggle Soccer').click();
        });
        expect(JSON.parse(getByTestId('favorites').textContent || '')).toContain('soccer');
    });

    it('should remove a sport from favoriteSports if already present', () => {
        const { getByText, getByTestId } = render(
            <OddsProvider>
                <TestComponent />
            </OddsProvider>
        );
        act(() => {
            getByText('Toggle Soccer').click();
            getByText('Toggle Soccer').click();
        });
        expect(JSON.parse(getByTestId('favorites').textContent || '')).not.toContain('soccer');
    });

    it('should persist favoriteSports to localStorage', () => {
        const { getByText } = render(
            <OddsProvider>
                <TestComponent />
            </OddsProvider>
        );
        act(() => {
            getByText('Toggle Basketball').click();
        });
        expect(JSON.parse(localStorage.getItem('favoriteSports') || '[]')).toContain('basketball');
    });
});