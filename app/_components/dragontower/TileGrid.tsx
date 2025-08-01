'use client';
import React from 'react';
import { useDragonTowerStore } from '@/app/_store/dragonTowerStore';

const EASY_MULTIPLIERS = [3.2, 2.5, 2.0, 1.6, 1.3, 1.1];
const MEDIUM_MULTIPLIERS = [12.0, 7.8, 5.0, 3.2, 2.1, 1.5];
const HARD_MULTIPLIERS = [50.0, 20.0, 10.0, 6.5, 3.5, 2.0];

const NUM_ROWS = 6;
const NUM_COLS = 5;

export default function TileGrid() {
  const {
    selectedTiles,
    lossIndex,
    selectTile,
    isGameActive,
    difficulty,
  } = useDragonTowerStore();

  const getMultipliers = () => {
    if (difficulty === 'easy') return EASY_MULTIPLIERS;
    if (difficulty === 'medium') return MEDIUM_MULTIPLIERS;
    return HARD_MULTIPLIERS;
  };

  const multipliers = getMultipliers();

  return (
    <div
      className={`
        relative
        bg-[#1e2a36] p-6 rounded-md border-[5px] border-[#4b5563]
        shadow-[inset_0_0_10px_#6b7280,inset_0_0_25px_#374151]
      `}
    >
     
      <div className="flex flex-col-reverse gap-2">
        {Array.from({ length: NUM_ROWS }, (_, rowIndex) => {
          const trueRow = NUM_ROWS - 1 - rowIndex;

          const tileRow = (
            <div key={`tiles-${trueRow}`} className="grid grid-cols-5 gap-2">
              {Array.from({ length: NUM_COLS }, (_, colIndex) => {
                const index = trueRow * NUM_COLS + colIndex;
                const isSelected = selectedTiles.includes(index);
                const isLoss = lossIndex === index;

                return (
                  <div
                    key={index}
                    className={`aspect-[2.5/1] rounded-md border border-[#2e3a45] flex items-center justify-center transition-all duration-300 ease-in-out
                      ${isLoss ? 'bg-red-700 animate-shake' : isSelected ? 'bg-green-600 animate-pulse' : 'bg-[#15212b] hover:bg-[#243340]'}
                    `}
                    onClick={() => isGameActive && selectTile(index)}
                  >
                    {isLoss && (
                      <img
                        src="/assets/dragonTower/skull.svg"
                        alt="Loss"
                        className="w-6 h-6 pointer-events-none"
                      />
                    )}
                    {isSelected && (
                      <img
                        src="/assets/dragonTower/egg.svg"
                        alt="Selected"
                        className="w-6 h-6 pointer-events-none"
                      />
                    )}
                    {!isSelected && !isLoss && isGameActive && (
                      <img
                        src="/assets/dragonTower/dragon.svg"
                        alt="Empty"
                        className="w-6 h-6 opacity-60 pointer-events-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );

          const anySelectedInRow = selectedTiles.some(
            (index) =>
              Math.floor(index / NUM_COLS) === trueRow
          );

          const multiplierRow = (
            <div
              key={`mult-${trueRow}`}
              className={`flex justify-center font-bold text-xs mb-1 transition-all
                ${anySelectedInRow ? 'text-green-400 animate-pulse drop-shadow-md' : 'text-gray-500'}
              `}
            >
              x{multipliers[trueRow]}
            </div>
          );

          return (
            <div key={rowIndex} className="flex flex-col gap-1">
              {multiplierRow}
              {tileRow}
            </div>
          );
        })}
      </div>
    </div>
  );
}
