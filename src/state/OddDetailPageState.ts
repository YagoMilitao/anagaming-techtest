import { OddData } from '@/data/Odd' 
import { fetchOddById } from '@/app/lib/fetchOdds' 

/**
 * @class OddDetailPageState
 * @description Gerencia o estado e a lógica de negócios para a página de detalhes de uma odd.
 * Inclui o carregamento de dados e o tratamento de erros.
 */
export class OddDetailPageState {
  loading: boolean = true
  odd: OddData | null = null
  errorMessage: string | null = null

  private sportKey: string
  private oddId: string

  constructor(sportKey: string, oddId: string) {
    this.sportKey = sportKey
    this.oddId = oddId
  }

  /**
   * @method loadOddDetails
   * @description Carrega os detalhes da odd da API.
   * Inclui tratamento de erro e validação básica dos dados recebidos.
   */
  async loadOddDetails() {
    try {
      this.setLoading(true)
      this.setErrorMessage(null) 
      this.setOdd(null)

      if (!this.sportKey || !this.oddId) {
        const msg = "Parâmetros de rota (sportKey ou oddId) ausentes para buscar detalhes da odd."
        console.error(msg)
        this.setErrorMessage(msg)
        return
      }

      const fetchedOdd = await fetchOddById(this.sportKey, this.oddId)

      if (fetchedOdd && typeof fetchedOdd === 'object' && fetchedOdd !== null) {
        this.setOdd(fetchedOdd)
      } else {
        const msg = `Nenhum detalhe de odd encontrado para o evento ${this.oddId} no esporte ${this.sportKey}.`
        console.warn(msg, "Dados recebidos:", fetchedOdd)
        this.setErrorMessage(msg)
        this.setOdd(null)
      }

    } catch (error: unknown) { 
      let errorMessage = "Erro desconhecido ao carregar detalhes da odd."
      if (error instanceof Error) { 
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error(`Erro ao carregar detalhes da odd ${this.oddId}:`, error)
      this.setErrorMessage(errorMessage) 
      this.setOdd(null) 
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * @method setLoading
   * @description Define o estado de carregamento.
   * @param {boolean} value - O novo valor para o estado de carregamento.
   */
  setLoading(value: boolean) {
    this.loading = value
  }

  /**
   * @method setOdd
   * @description Define os dados da odd.
   * @param {OddData | null} data - O objeto OddData ou null.
   */
  setOdd(data: OddData | null) {
    if (data === null || (typeof data === 'object' && data !== null && 'id' in data && 'sport_title' in data)) {
      this.odd = data
    } else {
      console.error("setOdd: Tentativa de definir odd com um valor inválido. Recebido:", data)
      this.odd = null
      this.setErrorMessage("Dados da odd internos corrompidos.")
    }
  }

  /**
   * @method setErrorMessage
   * @description Define uma mensagem de erro para ser exibida na UI.
   * @param {string | null} message - A mensagem de erro ou null para limpar.
   */
  setErrorMessage(message: string | null) {
    this.errorMessage = message
  }
}
