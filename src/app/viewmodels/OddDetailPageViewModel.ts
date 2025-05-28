// src/viewmodels/OddDetailPageViewModel.ts

import { OddDetailPageState } from '@/state/OddDetailPageState'; // Importe a classe de estado
import { OddData, Bookmaker, Market, Outcome } from '@/data/Odd'; // Importe as interfaces

/**
 * @interface OddDetailDisplayData
 * @description Define a estrutura de dados que a UI da OddDetailPage espera para renderização.
 * Contém dados formatados e flags de estado.
 */
export interface OddDetailDisplayData {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  oddFound: boolean; // Indica se uma odd válida foi encontrada
  
  // Dados da odd formatados para exibição
  homeTeam: string;
  awayTeam: string;
  leagueName: string;
  formattedDate: string;
  formattedTime: string;
  bookmakers: Bookmaker[]; // Mantemos a estrutura original dos bookmakers
}

/**
 * @class OddDetailPageViewModel
 * @description Constrói um ViewModel a partir do estado da OddDetailPageState,
 * fornecendo os dados formatados para a UI.
 */
export class OddDetailPageViewModel {
  private state: OddDetailPageState;

  constructor(state: OddDetailPageState) {
    this.state = state;
  }

  /**
   * @method getDisplayData
   * @description Retorna um objeto com todos os dados formatados e flags de estado
   * necessários para renderizar a OddDetailPage.
   * @returns {OddDetailDisplayData} Os dados prontos para a UI.
   */
  getDisplayData(): OddDetailDisplayData {
    const { loading, odd, errorMessage } = this.state;

    // Tratativa de erro/estado: Se estiver carregando ou com erro, retorna o estado básico
    if (loading) {
      return {
        isLoading: true,
        hasError: false,
        errorMessage: null,
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      };
    }

    if (errorMessage) {
      return {
        isLoading: false,
        hasError: true,
        errorMessage: errorMessage,
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      };
    }

    // Se não está carregando e não tem erro, mas a odd é nula
    if (!odd) {
      return {
        isLoading: false,
        hasError: false,
        errorMessage: "Odd não encontrada.", // Mensagem específica para odd não encontrada
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      };
    }

    // Tratativa de erro: Valida as propriedades essenciais da odd antes de formatar
    if (typeof odd.home_team !== 'string' || typeof odd.away_team !== 'string' ||
        typeof odd.commence_time !== 'string' || !Array.isArray(odd.bookmakers)) {
      console.error("OddDetailPageViewModel: Dados da odd incompletos ou inválidos.", odd);
      return {
        isLoading: false,
        hasError: true,
        errorMessage: "Dados da odd incompletos ou inválidos para exibição.",
        oddFound: false,
        homeTeam: '', awayTeam: '', leagueName: '',
        formattedDate: '', formattedTime: '', bookmakers: []
      };
    }

    // Formatação de datas
    const commenceDate = new Date(odd.commence_time);
    const formattedDate = isNaN(commenceDate.getTime()) ? 'Data Inválida' : commenceDate.toLocaleDateString();
    const formattedTime = isNaN(commenceDate.getTime()) ? 'Hora Inválida' : commenceDate.toLocaleTimeString();

    return {
      isLoading: false,
      hasError: false,
      errorMessage: null,
      oddFound: true,
      homeTeam: odd.home_team,
      awayTeam: odd.away_team,
      leagueName: odd.league_name || odd.sport_title || 'N/A', // Prioriza league_name, senão sport_title
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      bookmakers: odd.bookmakers.map(bookmaker => ({
        ...bookmaker,
        // Tratativa de erro: Garante que markets é um array antes de mapear
        markets: Array.isArray(bookmaker.markets) ? bookmaker.markets.map(market => ({
          ...market,
          // Tratativa de erro: Garante que outcomes é um array antes de mapear
          outcomes: Array.isArray(market.outcomes) ? market.outcomes.map(outcome => ({
            ...outcome,
            // Tratativa de erro: Garante que price é um número ou string convertível
            price: typeof outcome.price === 'number' ? outcome.price : parseFloat(String(outcome.price)) || 0
          })) : []
        })) : []
      }))
    };
  }
}
