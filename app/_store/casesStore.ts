import { create } from 'zustand';
import { useCommonStore } from '@/app/_store/commonStore';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

type Transaction = {
  id: string;
  bet: number;
  multiplier: number;
  payout: number;
  timestamp: number;
};

type CasesState = {
  difficulty: Difficulty;
  isRolling: boolean;
  multiplier: number;
  resultIndex: number;
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  autoIntervalId: NodeJS.Timeout | null;
  instantMode: boolean;
  setInstantMode: (v: boolean) => void;
  rollResult: () => void;
  setDifficulty: (d: Difficulty) => void;
  betAmount: number;
  setBetAmount: (v: number) => void;
  history: Transaction[];
};

const difficultyChances: Record<Difficulty, number[]> = {
  easy:    [0.1, 0.2, 0.5, 1, 2, 5, 10, 23],
  medium:  [0, 0.1, 0.5, 1, 2, 5, 15, 50, 115],
  hard:    [0, 0.1, 0.5, 1, 2, 5, 20, 100, 1000],
  expert:  [0, 0.1, 0.5, 1, 2, 5, 50, 500, 10000],
};

export const useCasesStore = create<CasesState>((set, get) => ({
  difficulty: 'easy',
  isRolling: false,
  multiplier: 0,
  resultIndex: -1,
  autoPlay: false,
  autoIntervalId: null,
  instantMode: false,
  betAmount: 1,
  history: [],

  setBetAmount: (v) => set({ betAmount: v }),
  setDifficulty: (d) => set({ difficulty: d }),

  setAutoPlay: (value) => {
    if (value) {
      const id = setInterval(() => {
        if (!get().isRolling) get().rollResult();
      }, get().instantMode ? 100 : 2500);
      set({ autoPlay: true, autoIntervalId: id });
    } else {
      clearInterval(get().autoIntervalId!);
      set({ autoPlay: false, autoIntervalId: null });
    }
  },

  setInstantMode: (v) => set({ instantMode: v }),

  rollResult: () => {
    const { difficulty, betAmount, instantMode } = get();
    const multipliers = difficultyChances[difficulty];

    const weights = multipliers.map((m) => (1 / (m + 1)) * 100);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * totalWeight;

    let acc = 0, idx = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (rand <= acc) {
        idx = i;
        break;
      }
    }

    const winMultiplier = multipliers[idx];
    const { balance, setBalance } = useCommonStore.getState();
    if (balance < betAmount) return;

    setBalance(balance - betAmount);
    set({ isRolling: true, resultIndex: idx, multiplier: winMultiplier });

    setTimeout(() => {
      const winnings = betAmount * winMultiplier;
      useCommonStore.getState().setBalance(balance - betAmount + winnings);

      // Push to history
      const tx: Transaction = {
        id: crypto.randomUUID(),
        bet: betAmount,
        multiplier: winMultiplier,
        payout: winnings,
        timestamp: Date.now(),
      };

      set((s) => ({
        isRolling: false,
        history: [tx, ...s.history].slice(0, 20),
      }));
    }, instantMode ? 0 : 2200);
  }
}));
