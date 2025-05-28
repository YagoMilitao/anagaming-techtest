
import { OddData } from '@/data/Odd'; // Importe a interface OddData
import { fetchOddById } from '@/app/lib/fetchOdds'; // Importe a função de busca da odd

/**
 * @class OddDetailPageState
 * @description Gerencia o estado e a lógica de negócios para a página de detalhes de uma odd.
 * Inclui o carregamento de dados e o tratamento de erros.
 */
export class OddDetailPageState {
  loading: boolean = true;
  odd: OddData | null = null;
  errorMessage: string | null = null;

  // Parâmetros da URL que serão usados para buscar a odd
  private sportKey: string;
  private oddId: string;

  constructor(sportKey: string, oddId: string) {
    this.sportKey = sportKey;
    this.oddId = oddId;
    // Se estiver usando MobX, descomente a linha abaixo para tornar o estado observável
    // makeAutoObservable(this); 
  }

  /**
   * @method loadOddDetails
   * @description Carrega os detalhes da odd da API.
   * Inclui tratamento de erro e validação básica dos dados recebidos.
   */
  async loadOddDetails() {
    try {
      this.setLoading(true);
      this.setErrorMessage(null); // Limpa qualquer erro anterior
      this.setOdd(null); // Limpa a odd anterior enquanto carrega

      // Tratativa de erro: Verifica se os parâmetros são válidos
      if (!this.sportKey || !this.oddId) {
        const msg = "Parâmetros de rota (sportKey ou oddId) ausentes para buscar detalhes da odd.";
        console.error(msg);
        this.setErrorMessage(msg);
        return;
      }

      // Chama a função de busca da API
      const fetchedOdd = await fetchOddById(this.sportKey, this.oddId);

      // Tratativa de erro: Verifica se a API retornou dados válidos
      if (fetchedOdd && typeof fetchedOdd === 'object' && fetchedOdd !== null) {
        this.setOdd(fetchedOdd);
      } else {
        const msg = `Nenhum detalhe de odd encontrado para o evento ${this.oddId} no esporte ${this.sportKey}.`;
        console.warn(msg, "Dados recebidos:", fetchedOdd);
        this.setErrorMessage(msg);
        this.setOdd(null); // Garante que a odd é nula se não houver dados válidos
      }

    } catch (error: any) {
      console.error(`Erro ao carregar detalhes da odd ${this.oddId}:`, error);
      this.setErrorMessage(error.message || "Erro desconhecido ao carregar detalhes da odd.");
      this.setOdd(null); // Garante que a odd é nula em caso de erro
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * @method setLoading
   * @description Define o estado de carregamento.
   * @param {boolean} value - O novo valor para o estado de carregamento.
   */
  setLoading(value: boolean) {
    this.loading = value;
  }

  /**
   * @method setOdd
   * @description Define os dados da odd.
   * @param {OddData | null} data - O objeto OddData ou null.
   */
  setOdd(data: OddData | null) {
    // Tratativa de erro: Garante que o input é um objeto OddData ou null
    if (data === null || (typeof data === 'object' && data !== null && 'id' in data && 'sport_title' in data)) {
      this.odd = data;
    } else {
      console.error("setOdd: Tentativa de definir odd com um valor inválido. Recebido:", data);
      this.odd = null; // Define como null para manter a consistência do tipo
      this.setErrorMessage("Dados da odd internos corrompidos.");
    }
  }

  /**
   * @method setErrorMessage
   * @description Define uma mensagem de erro para ser exibida na UI.
   * @param {string | null} message - A mensagem de erro ou null para limpar.
   */
  setErrorMessage(message: string | null) {
    this.errorMessage = message;
  }
}
