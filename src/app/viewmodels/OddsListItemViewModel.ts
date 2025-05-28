
import { OddData, Bookmaker } from '@/data/Odd'

/**
 * @interface IOddsListItemViewModel
 * @description Interface que define a estrutura de dados para o ViewModel de um item da lista de odds.
 * Ela contém as informações necessárias para renderizar um item na OddsList,
 * incluindo as melhores odds calculadas.
 * Renomeada para evitar conflito de "declaration merging" com a classe.
 */
export interface IOddsListItemViewModel { 
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  league_name?: string 
  

  bestPriceHome: string
  bestOutcomeHome: string | null
  bestBookmakerHome: string | null
  bestPriceAway: string
  bestOutcomeAway: string | null
  bestBookmakerAway: string | null
}

/**
 * @class OddsListItemViewModel
 * @description Classe responsável por transformar um objeto OddData bruto da API
 * em um ViewModel pronto para ser exibido na lista, calculando
 * as melhores odds.
 * Implementa a interface IOddsListItemViewModel.
 */
export class OddsListItemViewModel implements IOddsListItemViewModel {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  league_name?: string 
  bestPriceHome: string
  bestOutcomeHome: string | null
  bestBookmakerHome: string | null
  bestPriceAway: string
  bestOutcomeAway: string | null
  bestBookmakerAway: string | null

  constructor(odd: OddData) {
    this.id = odd.id
    this.sport_key = odd.sport_key
    this.sport_title = odd.sport_title
    this.commence_time = odd.commence_time
    this.home_team = odd.home_team
    this.away_team = odd.away_team
    this.league_name = odd.league_name 

    const { 
      bestPriceHome, 
      bestOutcomeHome, 
      bestBookmakerHome, 
      bestPriceAway, 
      bestOutcomeAway, 
      bestBookmakerAway 
    } = this.getBestH2HOutcome(odd.bookmakers, odd.home_team, odd.away_team)

    this.bestPriceHome = bestPriceHome
    this.bestOutcomeHome = bestOutcomeHome
    this.bestBookmakerHome = bestBookmakerHome
    this.bestPriceAway = bestPriceAway
    this.bestOutcomeAway = bestOutcomeAway
    this.bestBookmakerAway = bestBookmakerAway
  }

  /**
   * @private
   * @method getBestH2HOutcome
   * @description Encontra a melhor odd (maior preço) para o mercado 'h2h' (Head to Head)
   * para os times da casa e visitante.
   * @param {Bookmaker[]} bookmakers - Array de casas de apostas com seus mercados e outcomes.
   * @param {string} homeTeamName - Nome do time da casa.
   * @param {string} awayTeamName - Nome do time visitante.
   * @returns {object} Um objeto contendo as melhores odds e casas de apostas para cada time.
   */
  private getBestH2HOutcome(bookmakers: Bookmaker[], homeTeamName: string, awayTeamName: string) {
    let bestPriceHome = -1
    let bestPriceAway = -1
    let bestOutcomeHome: string | null = null
    let bestOutcomeAway: string | null = null
    let bestBookmakerHome: string | null = null
    let bestBookmakerAway: string | null = null

    if (!Array.isArray(bookmakers)) {
      console.warn("getBestH2HOutcome: 'bookmakers' não é um array. Retornando valores padrão.")
      return { 
        bestPriceHome: '-', bestOutcomeHome: null, bestBookmakerHome: null,
        bestPriceAway: '-', bestOutcomeAway: null, bestBookmakerAway: null
      }
    }

    bookmakers.forEach((bookmaker) => {

      const h2hMarket = Array.isArray(bookmaker.markets) ? bookmaker.markets.find((market) => market.key === 'h2h') : undefined
      
      if (h2hMarket && Array.isArray(h2hMarket.outcomes)) {
        h2hMarket.outcomes.forEach((outcome) => {
          const price = typeof outcome.price === 'number' 
            ? outcome.price 
            : (typeof outcome.price === 'string' ? parseFloat(outcome.price) : NaN)
          
          if (isNaN(price)) {
            console.warn(`getBestH2HOutcome: Preço inválido para o resultado ${outcome.name || 'desconhecido'}. Ignorando.`)
            return
          }

          const outcomeName = typeof outcome.name === 'string' ? outcome.name.toLowerCase() : ''

          if (outcomeName.includes(homeTeamName.toLowerCase())) {
            if (price > bestPriceHome) {
              bestPriceHome = price
              bestOutcomeHome = outcome.name
              bestBookmakerHome = bookmaker.title
            }
          } else if (outcomeName.includes(awayTeamName.toLowerCase())) {
            if (price > bestPriceAway) {
              bestPriceAway = price
              bestOutcomeAway = outcome.name
              bestBookmakerAway = bookmaker.title
            }
          }
        })
      }
    })

    return { 
      bestPriceHome: bestPriceHome > 0 ? bestPriceHome.toFixed(2) : '-', 
      bestOutcomeHome, 
      bestBookmakerHome, 
      bestPriceAway: bestPriceAway > 0 ? bestPriceAway.toFixed(2) : '-', 
      bestOutcomeAway, 
      bestBookmakerAway 
    }
  }
}
