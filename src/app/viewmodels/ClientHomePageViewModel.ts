import { ClientHomePageState } from '@/state/ClientHomePageState'
import { OddData } from '@/data/Odd'

/**
 * @interface IClientHomePageViewModel
 * @description Define a estrutura de dados que a UI da ClientHomePage espera para renderização.
 * Contém dados já processados (filtrados, ordenados, contagens) e mensagens de erro.
 * Renomeada para evitar conflito de "declaration merging" com a classe.
 */
export interface IClientHomePageViewModel {
  loading: boolean
  liveGames: OddData[]
  futureGames: OddData[]
  finishedGames: OddData[]
  liveGamesCount: number
  futureGamesCount: number
  finishedGamesCount: number
  showClearFavoritesButton: boolean
}

/**
 * @class ClientHomePageViewModel
 * @description Constrói um ViewModel a partir do estado da ClientHomePageState,
 * fornecendo os dados formatados para a UI.
 * Implementa a interface IClientHomePageViewModel.
 */
export class ClientHomePageViewModel implements IClientHomePageViewModel { 

  loading: boolean
  liveGames: OddData[]
  futureGames: OddData[]
  finishedGames: OddData[]
  liveGamesCount: number
  futureGamesCount: number
  finishedGamesCount: number
  showClearFavoritesButton: boolean

  constructor(private state: ClientHomePageState) {
    this.loading = state.loading
    this.liveGames = state.getSortedLiveGames()
    this.futureGames = state.getSortedFutureGames()
    this.finishedGames = state.getSortedFinishedGames()
    this.liveGamesCount = this.liveGames.length
    this.futureGamesCount = this.futureGames.length
    this.finishedGamesCount = this.finishedGames.length
    this.showClearFavoritesButton = state.favoriteSports.length > 0
  }

  /**
   * @method getDisplayData
   * @description Retorna o próprio ViewModel, que já contém os dados prontos para exibição.
   * Este método é útil se você quiser encapsular a forma como os dados são acessados
   * do ViewModel, mas para este ViewModel simples, as propriedades públicas já servem.
   * Mantenho para consistência com o padrão, mas você pode acessar as propriedades diretamente.
   * @returns {IClientHomePageViewModel} Os dados prontos para a UI.
   */
  getDisplayData(): IClientHomePageViewModel {
    return this
  }
}
