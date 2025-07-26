// src/app/games/Cases.tsx
'use client';
import React from 'react';
import CasesBoard from '@/app/_components/cases/CasesBoard';
import TransactionHistory from '@/app/_components/cases/TransactionHistory';
import { useCasesStore } from '@/app/_store/casesStore';
import { useCommonStore } from '@/app/_store/commonStore';

const difficultyOptions = ['easy', 'medium', 'hard', 'expert'] as const;

const Cases = () => {
  const {
    rollResult,
    isRolling,
    difficulty,
    setDifficulty,
    multiplier,
    autoPlay,
    setAutoPlay,
    instantMode,
    setInstantMode,
    betAmount,
    setBetAmount
  } = useCasesStore();

  const balance = useCommonStore((s: { balance: number }) => s.balance);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setBetAmount(Number(value.toFixed(2)));
    }
  };

  return (
    <div className="flex flex-col items-center p-6 gap-6 text-white">
      <h1 className="text-3xl font-bold">Cases</h1>

      {/* Difficulty */}
      <div className="flex gap-3">
        {difficultyOptions.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-md font-medium uppercase transition ${
              difficulty === d
                ? 'bg-blue-500 text-black shadow-md'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Bet Input */}
      <div className="flex flex-col items-center gap-1">
        <label className="text-sm">Bet Amount</label>
        <input
          type="number"
          min={0.01}
          max={balance}
          step={0.01}
          value={betAmount}
          onChange={handleBetChange}
          className="px-3 py-1 rounded bg-gray-800 text-white w-28 text-center"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
          />
          Auto-Play
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={instantMode}
            onChange={(e) => setInstantMode(e.target.checked)}
          />
          Instant Mode
        </label>
      </div>

      {/* Cases Reel */}
      <CasesBoard />

      {/* Button */}
      <button
        disabled={isRolling || betAmount <= 0 || betAmount > balance}
        onClick={rollResult}
        className="px-6 py-2 bg-green-500 text-black rounded font-semibold disabled:opacity-50"
      >
        {isRolling ? 'Rolling...' : 'Open Case'}
      </button>

      {/* Result */}
      {!isRolling && multiplier > 0 && (
        <div className="mt-4 text-xl text-green-400 glow-animation">You won {multiplier}x!</div>
      )}
      {!isRolling && multiplier === 0 && (
        <div className="mt-4 text-xl text-red-400 bounce">You lost! 😢</div>
      )}

      <TransactionHistory />
    </div>
  );
};

export default Cases;
