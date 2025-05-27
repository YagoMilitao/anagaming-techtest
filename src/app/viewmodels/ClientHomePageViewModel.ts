import { ClientHomePageState } from '@/state/ClientHomePageState'; // Importe a classe de estado
import { OddData } from '@/data/Odd'; // Importe a interface OddData

/**
 * @interface ClientHomePageViewModel
 * @description Define a estrutura de dados que a UI da ClientHomePage espera para renderização.
 * Contém dados já processados (filtrados, ordenados, contagens).
 */
export interface ClientHomePageViewModel {
  loading: boolean;
  liveGames: OddData[];
  futureGames: OddData[];
  finishedGames: OddData[];
  liveGamesCount: number;
  futureGamesCount: number;
  finishedGamesCount: number;
  showClearFavoritesButton: boolean;
}

/**
 * @class ClientHomePageViewModel
 * @description Constrói um ViewModel a partir do estado da ClientHomePageState,
 * fornecendo os dados formatados para a UI.
 */
export class ClientHomePageViewModel {
  constructor(private state: ClientHomePageState) {
    this.loading = state.loading;
    this.liveGames = state.getSortedLiveGames();
    this.futureGames = state.getSortedFutureGames();
    this.finishedGames = state.getSortedFinishedGames();
    this.liveGamesCount = this.liveGames.length;
    this.futureGamesCount = this.futureGames.length;
    this.finishedGamesCount = this.finishedGames.length;
    this.showClearFavoritesButton = state.favoriteSports.length > 0;
  }
}
