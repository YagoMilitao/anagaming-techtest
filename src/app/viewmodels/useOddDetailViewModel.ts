// app/viewmodels/useOddDetailViewModel.ts
'use client';

import { useState, useEffect } from 'react';
import { fetchOddById } from '@/app/lib/fetchOdds';
import { OddDetailState } from '@/state/OddDetailState';


export function useOddDetailViewModel(sport: string, oddId: string) {
  const [state, setState] = useState(OddDetailState.loadingState());

  useEffect(() => {
    async function loadOdd() {
      try {
        const data = await fetchOddById(sport, oddId);
        if (!data) {
          setState(OddDetailState.errorState("Não foi possível encontrar os detalhes do evento."));
          return;
        }
        setState(OddDetailState.successState(data));
      } catch (err: any) {
        setState(OddDetailState.errorState(err.message || "Erro ao carregar detalhes da odd."));
        console.error(err);
      }
    }

    if (sport && oddId) {
      setState(OddDetailState.loadingState());
      loadOdd();
    }
  }, [sport, oddId]);

  return state;
}
