import { fetchOddsData, fetchAllSports } from '@/app/lib/fetchOdds' 
import { OddData, SportGroup } from '@/data/Odd' 

/**
 * @class ClientHomePageState
 * @description Gerencia o estado e a lógica de negócios da página inicial.
 * Inclui o carregamento de dados, filtragem, ordenação e gerenciamento de filtros.
 */
export class ClientHomePageState {
  
  loading: boolean = true
  odds: OddData[] = []
  allSports: SportGroup[] = [] 
  selectedChampionship: string | null = null
  selectedSport: string | null = null
  favoriteSports: string[] = [] 

  /**
   * @method loadInitialData
   * @description Carrega os dados iniciais das odds e de todos os esportes.
   */
  async loadInitialData() {
    try {
      this.setLoading(true)
      const [oddsData, sportsData] = await Promise.all([
        fetchOddsData(),
        fetchAllSports()
      ])
      this.setOdds(oddsData)
      this.setAllSports(sportsData)
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
    } finally {
      this.setLoading(false)
    }
  }

  setLoading(value: boolean) {
    this.loading = value
  }

  setOdds(data: OddData[]) {
    this.odds = data
  }

  setAllSports(sports: SportGroup[]) {
    this.allSports = sports
  }

  setSelectedChampionship(championship: string | null) {
    this.selectedChampionship = championship
  }

  setSelectedSport(sport: string | null) {
    this.selectedSport = sport
  }

  toggleFavoriteSport(sportKey: string) {
    if (this.favoriteSports.includes(sportKey)) {
      this.favoriteSports = this.favoriteSports.filter(fav => fav !== sportKey)
    } else {
      this.favoriteSports.push(sportKey)
    }
  }

  clearFavoriteSports() {
    this.favoriteSports = []
  }


  /**
   * @method getFilteredOdds
   * @description Retorna as odds filtradas com base nos esportes e campeonatos selecionados.
   * @returns {OddData[]} As odds filtradas.
   */
  getFilteredOdds(): OddData[] {
    const selectedGroup = this.allSports.find((g) => g.group === this.selectedSport)
    const selectedKeys = selectedGroup ? selectedGroup.keys : []

    let filtered = this.odds

    if (selectedKeys.length > 0) {
      filtered = filtered.filter((odd) => selectedKeys.includes(odd.sport_key))
    }

    filtered = filtered.filter((odd) => {
      const matchesSport = this.selectedSport ? odd.sport_title === this.selectedSport : true
      const matchesChamp = this.selectedChampionship ? odd.league_name === this.selectedChampionship : true
      return matchesSport && matchesChamp
    })

    return filtered
  }

  /**
   * @method getLiveGames
   * @description Retorna os jogos considerados "ao vivo".
   * @returns {OddData[]} Jogos ao vivo.
   */
  getLiveGames(): OddData[] {
    const now = Date.now()
    return this.getFilteredOdds().filter((odd) => {
      const start = new Date(odd.commence_time).getTime()
      return start <= now && now <= start + 3 * 60 * 60 * 1000
    })
  }

  /**
   * @method getFutureGames
   * @description Retorna os jogos futuros.
   * @returns {OddData[]} Jogos futuros.
   */
  getFutureGames(): OddData[] {
    const now = Date.now()
    return this.getFilteredOdds().filter((odd) => {
      const start = new Date(odd.commence_time).getTime()
      return start > now
    })
  }

  /**
   * @method getFinishedGames
   * @description Retorna os jogos encerrados.
   * @returns {OddData[]} Jogos encerrados.
   */
  getFinishedGames(): OddData[] {
    const now = Date.now()
    return this.getFilteredOdds().filter((odd) => {
      const start = new Date(odd.commence_time).getTime()
      return start + 3 * 60 * 60 * 1000 < now 
    })
  }

  /**
   * @private
   * @method sortByCommenceTimeAsc
   * @description Ordena um array de jogos por tempo de início ascendente.
   * @param {OddData[]} games - Array de jogos.
   * @returns {OddData[]} Array ordenado.
   */
  private sortByCommenceTimeAsc(games: OddData[]): OddData[] {
    return [...games].sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())
  }

  /**
   * @private
   * @method sortByCommenceTimeDesc
   * @description Ordena um array de jogos por tempo de início descendente.
   * @param {OddData[]} games - Array de jogos.
   * @returns {OddData[]} Array ordenado.
   */
  private sortByCommenceTimeDesc(games: OddData[]): OddData[] {
    return [...games].sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime())
  }

  /**
   * @method getSortedLiveGames
   * @description Retorna os jogos ao vivo ordenados.
   * @returns {OddData[]} Jogos ao vivo ordenados.
   */
  getSortedLiveGames(): OddData[] {
    return this.sortByCommenceTimeAsc(this.getLiveGames())
  }

  /**
   * @method getSortedFutureGames
   * @description Retorna os jogos futuros ordenados.
   * @returns {OddData[]} Jogos futuros ordenados.
   */
  getSortedFutureGames(): OddData[] {
    return this.sortByCommenceTimeAsc(this.getFutureGames())
  }

  /**
   * @method getSortedFinishedGames
   * @description Retorna os jogos encerrados ordenados.
   * @returns {OddData[]} Jogos encerrados ordenados.
   */
  getSortedFinishedGames(): OddData[] {
    return this.sortByCommenceTimeDesc(this.getFinishedGames())
  }
}
