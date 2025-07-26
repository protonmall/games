// src/app/_components/cases/CasesControls.tsx
'use client';
import React from 'react';
import { useCasesStore } from '@/app/_store/casesStore';

export default function CasesControls() {
  const {
    betAmount,
    setBetAmount,
    difficulty,
    setDifficulty,
    rollResult,
    isRolling,
  } = useCasesStore();

  const handleHalf = () => setBetAmount(Number((betAmount / 2).toFixed(8)));
  const handleDouble = () => setBetAmount(Number((betAmount * 2).toFixed(8)));

  return (
    <div className="w-64 bg-gray-900 p-4 rounded-lg space-y-6 text-white">
      {/* Manual / Auto tabs (static “Manual” only for now) */}
      <div className="flex bg-gray-800 rounded-full overflow-hidden">
        <button className="flex-1 py-2 bg-gray-700">Manual</button>
        <button className="flex-1 py-2 text-gray-400">Auto</button>
      </div>

      {/* Bet Amount */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Bet Amount</label>
        <div className="flex">
          <input
            type="number"
            step="0.00000001"
            min="0"
            value={betAmount}
            onChange={(e) => setBetAmount(+e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 rounded-l outline-none text-white"
          />
          <button
            onClick={handleHalf}
            className="px-3 bg-gray-700 hover:bg-gray-600"
          >
            ½
          </button>
          <button
            onClick={handleDouble}
            className="px-3 bg-gray-700 hover:bg-gray-600 rounded-r"
          >
            2×
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="w-full px-3 py-2 bg-gray-800 rounded outline-none text-white"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {/* Bet Button */}
      <button
        onClick={rollResult}
        disabled={isRolling}
        className="w-full py-3 bg-green-500 hover:bg-green-400 rounded text-black font-bold disabled:opacity-50"
      >
        {isRolling ? 'Betting…' : 'Bet'}
      </button>
    </div>
  );
}
