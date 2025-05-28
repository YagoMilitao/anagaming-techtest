import { OddDetailPageState } from '@/state/OddDetailPageState' 
import {  Bookmaker } from '@/data/Odd'

/**
 * @interface OddDetailDisplayData
 * @description Define a estrutura de dados que a UI da OddDetailPage espera para renderização.
 * Contém dados formatados e flags de estado.
 */
export interface OddDetailDisplayData {
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  oddFound: boolean
  homeTeam: string
  awayTeam: string
  leagueName: string
  formattedDate: string
  formattedTime: string
  bookmakers: Bookmaker[] 
}

/**
 * @class OddDetailPageViewModel
 * @description Constrói um ViewModel a partir do estado da OddDetailPageState,
 * fornecendo os dados formatados para a UI.
 */
export class OddDetailPageViewModel {
  private state: OddDetailPageState

  constructor(state: OddDetailPageState) {
    this.state = state
  }

  /**
   * @method getDisplayData
   * @description Retorna um objeto com todos os dados formatados e flags de estado
   * necessários para renderizar a OddDetailPage.
   * @returns {OddDetailDisplayData} Os dados prontos para a UI.
   */
  getDisplayData(): OddDetailDisplayData {
    const { loading, odd, errorMessage } = this.state

    if (loading) {
      return {
        isLoading: true,
        hasError: false,
        errorMessage: null,
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      }
    }

    if (errorMessage) {
      return {
        isLoading: false,
        hasError: true,
        errorMessage: errorMessage,
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      }
    }


    if (!odd) {
      return {
        isLoading: false,
        hasError: false,
        errorMessage: "Odd não encontrada.",
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      }
    }

    
    if (typeof odd.home_team !== 'string' || typeof odd.away_team !== 'string' ||
        typeof odd.commence_time !== 'string' || !Array.isArray(odd.bookmakers)) {
      console.error("OddDetailPageViewModel: Dados da odd incompletos ou inválidos.", odd)
      return {
        isLoading: false,
        hasError: true,
        errorMessage: "Dados da odd incompletos ou inválidos para exibição.",
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      }
    }

    
    const commenceDate = new Date(odd.commence_time)
    const formattedDate = isNaN(commenceDate.getTime()) ? 'Data Inválida' : commenceDate.toLocaleDateString()
    const formattedTime = isNaN(commenceDate.getTime()) ? 'Hora Inválida' : commenceDate.toLocaleTimeString()

    return {
      isLoading: false,
      hasError: false,
      errorMessage: null,
      oddFound: true,
      homeTeam: odd.home_team,
      awayTeam: odd.away_team,
      leagueName: odd.league_name || odd.sport_title || 'N/A', 
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      bookmakers: odd.bookmakers.map(bookmaker => ({
        ...bookmaker,
        markets: Array.isArray(bookmaker.markets) ? bookmaker.markets.map(market => ({
          ...market,
          outcomes: Array.isArray(market.outcomes) ? market.outcomes.map(outcome => ({
            ...outcome,
            price: typeof outcome.price === 'number' ? outcome.price : parseFloat(String(outcome.price)) || 0
          })) : []
        })) : []
      }))
    }
  }
}
