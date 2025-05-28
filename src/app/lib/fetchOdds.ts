import { OddData, SportGroup } from '@/data/Odd' 

export async function fetchOddsData(): Promise<OddData[]> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY
        if (!apiKey) {
            throw new Error("API key não definida. Verifique suas variáveis de ambiente.")
        }

        const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`
        const res = await fetch(url, { cache: 'no-store' })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Erro ao buscar odds: ${res.status} - ${res.statusText} - ${errorText}`)
        }

        const data: OddData[] = await res.json()
        if (!Array.isArray(data)) {
            console.error("fetchOddsData: Resposta da API não é um array de OddData.", data)
            return []
        }
        return data
    } catch (error) {
        console.error("Erro em fetchOddsData:", error)
        return [] 
    }
}

export async function fetchOddById(sport: string, eventId: string): Promise<OddData | null> {
    const apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY
    if (!apiKey) {
        console.error("API key não definida.")
        return null
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds?apiKey=${apiKey}&regions=us`

    try {
        const response = await fetch(apiUrl)

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`Erro ao buscar evento: ${response.status} - ${response.statusText} - ${errorText}`)
            return null
        }

        const data: OddData = await response.json() 
        if (!data || typeof data !== 'object' || !('id' in data)) {
            console.warn(`fetchOddById: Dados recebidos para evento ${eventId} não são um objeto OddData válido.`, data)
            return null
        }
        return data
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(`Erro ao buscar detalhes do evento ${eventId} para o esporte ${sport}:`, error)
        return null
    }
}

export async function fetchSports(): Promise<SportGroup[]> {
    const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.ODDS_API_KEY}`
    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) throw new Error('Erro ao buscar esportes')
    const data: SportGroup[] = await res.json()
    if (!Array.isArray(data)) {
        console.error("fetchSports: Resposta da API não é um array de SportGroup.", data)
        return []
    }
    return data
}

export async function fetchAllSports(): Promise<SportGroup[]> {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.NEXT_PUBLIC_ODDS_API_KEY}`)

    if (!res.ok) {
        throw new Error('Erro ao buscar todos os esportes')
    }
    const data: SportGroup[] = await res.json()
    if (!Array.isArray(data)) {
        console.error("fetchAllSports: Resposta da API não é um array de SportGroup.", data)
        return []
    }
    return data
}

