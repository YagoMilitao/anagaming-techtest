import { ClientHomePageViewModel } from "@/app/viewmodels/ClientHomePageViewModel";
import { OddData } from "@/data/Odd";
import { ClientHomePageState } from "@/state/ClientHomePageState";




describe('ClientHomePageViewModel', () => {
    let mockState: jest.Mocked<ClientHomePageState>;
    let liveGames: OddData[];
    let futureGames: OddData[];
    let finishedGames: OddData[];

    beforeEach(() => {
        liveGames = [
            {
                id: '1',
                name: 'Live Game 1',
                eventId: '1',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
                
            },
            {
                id: '2',
                name: 'Live Game 2',
                eventId: '2',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
            },
        ];
        futureGames = [
            {
                id: '3',
                name: 'Live Game 2',
                eventId: '2',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
            },
        ];
        finishedGames = [
            {
                id: '4',
                name: 'Live Game 2',
                eventId: '2',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
            },
            {
                
                id: '5',
                name: 'Live Game 2',
                eventId: '2',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
            },
            {
                id: '6',
                name: 'Live Game 2',
                eventId: '2',
                sport: 'football',
                status: 'live',
                sport_title: 'Football',
                commence_time: '2024-01-01T12:00:00Z',
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [],
                last_update: '2024-01-01T12:00:00Z',
                sport_key: 'football',
            },
        ];

        mockState = {
            loading: false,
            getSortedLiveGames: jest.fn().mockReturnValue(liveGames),
            getSortedFutureGames: jest.fn().mockReturnValue(futureGames),
            getSortedFinishedGames: jest.fn().mockReturnValue(finishedGames),
            favoriteSports: ['football'],
        } as any;
    });

    it('should set liveGamesCount based on the number of live games', () => {
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.liveGamesCount).toBe(liveGames.length);
    });

    it('should set futureGamesCount based on the number of future games', () => {
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.futureGamesCount).toBe(futureGames.length);
    });

    it('should set finishedGamesCount based on the number of finished games', () => {
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.finishedGamesCount).toBe(finishedGames.length);
    });

    it('should set loading from state', () => {
        mockState.loading = true;
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.loading).toBe(true);
    });

    it('should set showClearFavoritesButton to true if favoriteSports is not empty', () => {
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.showClearFavoritesButton).toBe(true);
    });

    it('should set showClearFavoritesButton to false if favoriteSports is empty', () => {
        mockState.favoriteSports = [];
        const vm = new ClientHomePageViewModel(mockState);
        expect(vm.showClearFavoritesButton).toBe(false);
    });
});