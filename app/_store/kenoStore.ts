import { create } from 'zustand';
import { GRID_NUMBERS, RISK_LEVELS } from '@/app/_components/keno/constants';
import { useCommonStore } from '@/app/_store/commonStore';
import { playSound } from '@/app/_lib/kenoutils';

type KenoState = {
  selected: number[];
  result: number[];
  isSpinning: boolean;
  autoPlay: boolean;
  autoCount: number;
  autoRoundLimit: number;
  completedAutoRounds: number;
  betAmount: number;
  matches: number;
  wins: number;
  losses: number;
  risk: string;

  toggleNumber: (n: number) => void;
  setBetAmount: (b: number) => void;
  setAutoPlay: (v: boolean) => void;
  setAutoCount: (c: number) => void;
  setRisk: (r: string) => void;
  incrementAutoRound: () => void;
  resetAutoRounds: () => void;
  recordWin: () => void;
  recordLoss: () => void;
  playRound: () => void;
  startAutoplay: () => void;
  resetGame: () => void;
  reset: () => void;
};

export const kenoStore = create<KenoState>((set, get) => ({
  selected: [],
  result: [],
  isSpinning: false,
  autoPlay: false,
  autoCount: 10,
  autoRoundLimit: 10,
  completedAutoRounds: 0,
  betAmount: 0,
  matches: 0,
  wins: 0,
  losses: 0,
  risk: RISK_LEVELS[1].label,

  toggleNumber: (n) => {
    const sel = get().selected;
    if (sel.includes(n)) {
      set({ selected: sel.filter(x => x !== n) });
    } else if (sel.length < 10) {
      set({ selected: [...sel, n] });
    }
    playSound('/assets/audio/bn.mp3');
  },

  setBetAmount: (b) => set({ betAmount: b }),
  setAutoPlay: (v) => set({ autoPlay: v }),
  setAutoCount: (c) => set({ autoRoundLimit: c }),
  setRisk: (r) => set({ risk: r }),

  incrementAutoRound: () =>
    set(state => ({ completedAutoRounds: state.completedAutoRounds + 1 })),
  resetAutoRounds: () => set({ completedAutoRounds: 0 }),

  recordWin: () => set(state => ({ wins: state.wins + 1 })),
  recordLoss: () => set(state => ({ losses: state.losses + 1 })),

  playRound: () => {
    const {
      selected,
      betAmount,
      risk,
      wins,
      losses
    } = get();

    const common = useCommonStore.getState();
    const balance = common.balance;

    if (selected.length === 0 || betAmount <= 0 || balance < betAmount) {
      console.warn('Invalid play: no selection or insufficient balance');
      return;
    }

    common.setBalance(balance - betAmount);
    set({ isSpinning: true });

    // 🔊 Start spinning sound
    const spinningAudio = new Audio('/assets/audio/cino.mp3');
    spinningAudio.loop = true;
    spinningAudio.play().catch(err => console.error("Spin audio error:", err));

    setTimeout(() => {
      const pool = [...GRID_NUMBERS];
      const draw: number[] = [];

      while (draw.length < 10) {
        const i = Math.floor(Math.random() * pool.length);
        draw.push(pool.splice(i, 1)[0]);
      }

      let matched = selected.filter(n => draw.includes(n));
      let hits = matched.length;

      // ✅ 50% win/loss control logic
      const forceWin = losses >= wins;
      if (forceWin && hits === 0) {
        const forcedHits = Math.min(selected.length, 3);
        matched = selected.slice(0, forcedHits);
        hits = matched.length;
        for (let i = 0; i < matched.length; i++) {
          if (!draw.includes(matched[i])) draw[i] = matched[i];
        }
      }

      const tier = RISK_LEVELS.find(r => r.label === risk)!;
      const multiplier = tier.multipliers[hits] || 0;
      const payout = betAmount * multiplier;

      if (payout > 0) {
        common.setBalance(common.balance + payout);
      }

      // 🔊 Stop spinning sound
      spinningAudio.pause();
      spinningAudio.currentTime = 0;

      // 🔊 Matched number sound
      matched.forEach((_, i) => {
        setTimeout(() => {
          playSound('/assets/audio/bn.mp3');
        }, i * 200);
      });

      set({
        result: draw,
        matches: hits,
        isSpinning: false,
      });

      if (payout > 0) get().recordWin();
      else get().recordLoss();
    }, 1000);
  },

  startAutoplay: () => {
    const { autoRoundLimit } = get();
    get().resetAutoRounds();
    set({ autoPlay: true });

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const autoPlayNext = async () => {
      const { completedAutoRounds, autoPlay } = get();
      if (!autoPlay || completedAutoRounds >= autoRoundLimit) {
        set({ autoPlay: false });
        return;
      }

      get().playRound();
      get().incrementAutoRound();

      while (get().isSpinning) {
        await wait(100);
      }

      await wait(300);
      autoPlayNext();
    };

    autoPlayNext();
  },

  resetGame: () =>
    set({
      selected: [],
      result: [],
      matches: 0,
      isSpinning: false,
      completedAutoRounds: 0,
    }),

  reset: () => get().resetGame(),
}));
