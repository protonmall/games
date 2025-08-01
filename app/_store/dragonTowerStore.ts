import { create } from 'zustand';
import { useCommonStore } from './commonStore';
import { playSound } from '@/app/_components/dragontower/useSound';

const EASY_MULTIPLIERS = [1.1, 1.3, 1.6, 2.0, 2.5, 3.2];
const MEDIUM_MULTIPLIERS = [1.5, 2.1, 3.2, 5.0, 7.8, 12.0];
const HARD_MULTIPLIERS = [2.0, 3.5, 6.5, 10.0, 20.0, 50.0];

type Difficulty = 'easy' | 'medium' | 'hard';

type AutoSettings = {
  stopProfit: number;
  stopLoss: number;
  initialBet: number;
};

type State = {
  isGameActive: boolean;
  selectedTiles: number[];
  lossIndex: number | null;
  betAmount: number;
  difficulty: Difficulty;
  currentWinnings: number; 

  autoPlay: boolean;
  autoInterval: NodeJS.Timeout | null;
  autoSettings: AutoSettings;

  setBetAmount: (amount: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAutoSettings: (settings: Partial<AutoSettings>) => void;

  startGame: () => void;
  selectTile: (index: number) => void;
  autoSelectTile: () => void;
  finishGame: (won: boolean) => void;
  cashOut: () => void; 

  startAuto: () => void;
  stopAuto: () => void;
};

const getMultipliers = (difficulty: Difficulty) => {
    if (difficulty === 'easy') return EASY_MULTIPLIERS;
    if (difficulty === 'medium') return MEDIUM_MULTIPLIERS;
    return HARD_MULTIPLIERS;
};

export const useDragonTowerStore = create<State>((set, get) => ({
  isGameActive: false,
  selectedTiles: [],
  lossIndex: null,
  betAmount: 1,
  difficulty: 'easy',
  currentWinnings: 0, 

  autoPlay: false,
  autoInterval: null,
  autoSettings: {
    stopProfit: 10,
    stopLoss: 10,
    initialBet: 1,
  },

  setBetAmount: (amount) => set({ betAmount: amount }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setAutoSettings: (settings) =>
    set((state) => ({
      autoSettings: {
        ...state.autoSettings,
        ...settings,
      },
    })),

  startGame: () => {
    playSound('start');
    set({
      isGameActive: true,
      selectedTiles: [],
      lossIndex: null,
      currentWinnings: 0, 
    });

    const { autoPlay } = get();
    if (autoPlay) {
      setTimeout(() => get().autoSelectTile(), 500);
    }
  },

  autoSelectTile: () => {
    const { selectedTiles, isGameActive, selectTile, lossIndex } = get();

    if (!isGameActive || lossIndex !== null) return;

    const NUM_ROWS = 6;
    const NUM_COLS = 5;
    const currentStep = selectedTiles.length;
    const expectedRow = NUM_ROWS - 1 - currentStep;
    const rowStart = expectedRow * NUM_COLS;

    const randomTile = Math.floor(Math.random() * NUM_COLS) + rowStart;
    selectTile(randomTile);
  },

  selectTile: (index: number) => {
    const NUM_ROWS = 6;
    const NUM_COLS = 5;
    const { selectedTiles, finishGame, lossIndex, autoPlay, betAmount, difficulty } = get();

    if (lossIndex !== null) return;

    const currentStep = selectedTiles.length;
    const expectedRow = NUM_ROWS - 1 - currentStep;
    const rowStart = expectedRow * NUM_COLS;

    if (index < rowStart || index >= rowStart + NUM_COLS) return;

    const lossTile = Math.floor(Math.random() * NUM_COLS) + rowStart;

    if (index === lossTile) {
      set({ lossIndex: index });
      playSound('fail');
      finishGame(false);
    } else {
      const updatedTiles = [...selectedTiles, index];
      set({ selectedTiles: updatedTiles });
      playSound('select');
      playSound('success');

      const multipliers = getMultipliers(difficulty);
      const newWinnings = betAmount * multipliers[updatedTiles.length - 1];
      set({ currentWinnings: newWinnings });


      if (updatedTiles.length === NUM_ROWS) {
        finishGame(true);
      } else if (autoPlay) {
        setTimeout(() => get().autoSelectTile(), 500);
      }
    }
  },

  finishGame: (won: boolean) => {
    const { betAmount, autoPlay, autoSettings, currentWinnings } = get();
    const { balance, setBalance, profitAmount, setProfitAmount } = useCommonStore.getState();

    let newBalance = balance;
    let profitChange = 0;

    if (won) {
      newBalance += currentWinnings; 
      profitChange = currentWinnings - betAmount;
      playSound('win');
    } else {
      newBalance -= betAmount;
      profitChange = -betAmount;
      playSound('loss');
    }

    setBalance(newBalance);
    setProfitAmount(profitAmount + profitChange);
    set({ currentWinnings: 0 }); 

    const profit = newBalance - 100;

    if (autoPlay) {
      if (
        profit >= autoSettings.stopProfit ||
        profit <= -autoSettings.stopLoss ||
        betAmount > newBalance
      ) {
        const { autoInterval } = get();
        if (autoInterval) clearInterval(autoInterval);
        set({ autoPlay: false, autoInterval: null, isGameActive: false });
        return;
      }

      setTimeout(() => {
        get().startGame();
      }, 1000);
    } else {
      set({ isGameActive: false });
    }
  },

  cashOut: () => {
    const { isGameActive, currentWinnings, betAmount } = get();
    const { balance, setBalance, profitAmount, setProfitAmount } = useCommonStore.getState();

    if (!isGameActive || currentWinnings === 0) return;

    const newBalance = balance + currentWinnings;
    const profitChange = currentWinnings - betAmount;

    setBalance(newBalance);
    setProfitAmount(profitAmount + profitChange);
    playSound('cashout');

    set({
      isGameActive: false,
      selectedTiles: [],
      lossIndex: null,
      currentWinnings: 0,
    });
  },

  startAuto: () => {
    const { betAmount, startGame, autoSelectTile } = get();
    const { balance, setBalance } = useCommonStore.getState();

    if (betAmount <= balance) {
      playSound('autoplay');
      setBalance(balance - betAmount);
      set({ autoPlay: true });
      startGame();
      setTimeout(() => {
        autoSelectTile();
      }, 300);
    }
  },

  stopAuto: () => {
    const { autoInterval } = get();
    if (autoInterval) clearInterval(autoInterval);
    playSound('stop');
    set({ autoPlay: false, autoInterval: null });
  },
}));