'use client';

import { create } from 'zustand';

export type Tile = {
  id: number;
  isSnake: boolean;
  multiplier: number | null;
  revealed: boolean;
  type?: 'normal' | 'dice';
};

type SnakeGameState = {
  tiles: Tile[];
  currentTile: number;
  rollResult: number;
  dice1Value: number;
  dice2Value: number;
  totalMultiplier: number;
  status: 'idle' | 'rolling' | 'lost' | 'won';
  difficulty: 'easy' | 'medium' | 'hard';
  autoPlay: boolean; 
  instantPlay: boolean;
  animatingTileId: number | null;
  isDicePressed: boolean;

  isManualMode: boolean;
  betAmount: number;
  numberOfBets: number;
  stopOnProfit: number;
  stopOnLoss: number;

  initializeGame: () => void;
  handleRollOrStart: () => void;
  rollDice: () => void;
  movePlayer: (steps: number) => void;
  finalizePlayerMove: (finalLandingIndex: number) => void;
  cashOut: () => void;
  setDifficulty: (difficulty: SnakeGameState['difficulty']) => void;
  toggleInstantPlay: () => void; 
  toggleMode: () => void;
  setBetAmount: (amount: number) => void;
  setNumberOfBets: (count: number) => void;
  setStopOnProfit: (amount: number) => void;
  setStopOnLoss: (amount: number) => void;
  startAutobet: () => void; 
  stopAutobet: () => void; 
};

const playSound = (soundFileName: string) => {
  try {
    const audio = new Audio(`/assets/snake/${soundFileName}`);
    audio.play().catch(e => console.error("Error playing sound:", soundFileName, e));
  } catch (error) {
    console.error("Failed to create Audio object:", error);
  }
};

const generateTiles = (difficulty: SnakeGameState['difficulty']): Tile[] => {
  const snakesPerDifficulty = {
    easy: 2,
    medium: 4,
    hard: 6,
  };

  const generateMultiplier = (diff: SnakeGameState['difficulty']): number => {
    let min: number;
    let max: number;

    switch (diff) {
      case 'easy':
        min = 1.1;
        max = 2.0;
        break;
      case 'medium':
        min = 1.1;
        max = 4.0;
        break;
      case 'hard':
        min = 1.1;
        max = 5.0;
        break;
      default:
        min = 1.1;
        max = 2.0;
    }
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  };

  const tiles: Tile[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    isSnake: false,
    multiplier: null,
    revealed: false,
  }));

  const snakeTiles = new Set<number>();
  const numSnakes = snakesPerDifficulty[difficulty];
  while (snakeTiles.size < numSnakes) {
    const rand = Math.floor(Math.random() * 12);
    if (rand !== 0) {
      snakeTiles.add(rand);
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    if (snakeTiles.has(i)) {
      tiles[i].isSnake = true;
    } else {
      if (i !== 0) {
        tiles[i].multiplier = generateMultiplier(difficulty);
      }
    }
  }

  tiles[0].isSnake = false;
  tiles[0].multiplier = null;

  return tiles;
};

export const useSnakeStore = create<SnakeGameState>((set, get) => ({
  tiles: [],
  currentTile: 0,
  rollResult: 0,
  dice1Value: 1,
  dice2Value: 1,
  totalMultiplier: 1,
  status: 'idle',
  difficulty: 'medium',
  autoPlay: false, 
  instantPlay: false,
  animatingTileId: null,
  isDicePressed: false,

  isManualMode: true, 
  betAmount: 0.00000000,
  numberOfBets: 1,
  stopOnProfit: 0,
  stopOnLoss: 0,

  initializeGame: () => {
    const currentDifficulty = get().difficulty;
    const initialTiles = generateTiles(currentDifficulty);
    set({
      tiles: initialTiles,
      currentTile: 0,
      rollResult: 0,
      totalMultiplier: 1,
      status: 'idle',
      animatingTileId: null,
      dice1Value: 1,
      dice2Value: 1,
      isDicePressed: false,
      autoPlay: false, 
    });
  },

  handleRollOrStart: () => {
    const state = get();
    if ((state.status === 'idle' && state.currentTile === 0 && state.totalMultiplier === 1) || state.status === 'lost' || state.status === 'won') {
      get().initializeGame();
      setTimeout(() => {
        get().rollDice();
      }, 50);
    } else if (state.status === 'idle') {
      get().rollDice();
    }
  },

  rollDice: () => {
    const state = get();
    if (state.status !== 'idle') return;

    set({ status: 'rolling' });

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const rollTotal = d1 + d2;

    set({
      rollResult: rollTotal,
      dice1Value: d1,
      dice2Value: d2,
      isDicePressed: true,
    });

    setTimeout(() => {
      set({ isDicePressed: false });
    }, 200);

    const animationDelay = state.instantPlay ? 0 : 200;

    playSound('dice.mp3');

    set({ animatingTileId: state.currentTile });

    for (let i = 1; i <= rollTotal; i++) {
      const nextTileId = (state.currentTile + i) % 12;
      const stepIndex = i;

      setTimeout(() => {
        set({ animatingTileId: nextTileId });

        if (stepIndex < rollTotal && animationDelay > 0) {
            playSound('button.mp3');
        }

        if (stepIndex === rollTotal) {
          get().finalizePlayerMove(nextTileId);
        }
      }, stepIndex * animationDelay);
    }

    if (state.instantPlay) {
        setTimeout(() => {
            get().finalizePlayerMove((state.currentTile + rollTotal) % 12);
        }, 50);
    }
  },

  finalizePlayerMove: (finalLandingIndex: number) => {
    const state = get();
    const tiles = [...state.tiles];
    const landingTile = tiles[finalLandingIndex];

    if (!landingTile) {
      console.error("Landing tile not found for ID:", finalLandingIndex);
      set({ status: 'idle', animatingTileId: null });
      return;
    }

    landingTile.revealed = true;

    let newMultiplier = state.totalMultiplier;
    let newStatus: 'idle' | 'lost' | 'won';

    if (landingTile.isSnake) {
      newStatus = 'lost';
      playSound('snake.mp3');
    } else if (finalLandingIndex === tiles.length - 1) {
      newStatus = 'won';
      playSound('vin.mp3');
    } else if (landingTile.multiplier) {
      newMultiplier *= landingTile.multiplier;
      newStatus = 'idle';
      playSound('level.mp3');
    } else {
      newStatus = 'idle';
      playSound('land.mp3');
    }

    set({
      tiles,
      currentTile: finalLandingIndex,
      totalMultiplier: newMultiplier,
      status: newStatus,
      animatingTileId: null,
    });
  },

  movePlayer: (steps: number) => {
    const state = get();
    const newIndex = (state.currentTile + steps) % 12;
    get().finalizePlayerMove(newIndex);
  },

  cashOut: () => {
    set({ status: 'won' });
  },

  setDifficulty: (difficulty) => {
    set({ difficulty });
    get().initializeGame();
  },
  toggleInstantPlay: () => set((state) => ({ instantPlay: !state.instantPlay })),

  toggleMode: () => set((state) => ({ isManualMode: !state.isManualMode })),
  setBetAmount: (amount) => set({ betAmount: amount }),
  setNumberOfBets: (count) => set({ numberOfBets: count }),
  setStopOnProfit: (amount) => set({ stopOnProfit: amount }),
  setStopOnLoss: (amount) => set({ stopOnLoss: amount }),
  startAutobet: () => {
    set({ autoPlay: true, status: 'idle' });
    get().handleRollOrStart(); 
  },
  stopAutobet: () => set({ autoPlay: false }),
}));