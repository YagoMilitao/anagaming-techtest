import { OddData } from '@/data/Odd';

export class OddDetailState {
  odd: OddData | null;
  loading: boolean;
  error: string | null;

  constructor({
    odd = null,
    loading = true,
    error = null,
  }: {
    odd?: OddData | null;
    loading?: boolean;
    error?: string | null;
  } = {}) {
    this.odd = odd;
    this.loading = loading;
    this.error = error;
  }

  static loadingState() {
    return new OddDetailState({ loading: true });
  }

  static errorState(message: string) {
    return new OddDetailState({ loading: false, error: message });
  }

  static successState(data: OddData) {
    return new OddDetailState({ odd: data, loading: false });
  }
}
