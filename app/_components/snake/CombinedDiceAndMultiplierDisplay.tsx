'use client';

import React from 'react';
import { useSnakeStore } from '@/app/_store/snakeStore';
import DiceFace from './DiceFace';

export default function CombinedDiceAndMultiplierDisplay() {
  const { dice1Value, dice2Value, totalMultiplier, isDicePressed } = useSnakeStore();

  const customBoxShadow = '0 4px 0 rgba(33, 55, 67, 0.4)';

  return (
    <div
      className={`
        w-[calc(80px*2+8px)] h-[calc(80px*2+8px)]
        rounded-md flex flex-col items-center justify-center gap-2
        bg-[#8694a4] // UPDATED: Main container background color
        border border-[#213743] // UPDATED: Main container border color
        transition-all duration-150 ease-in-out
        ${isDicePressed ? 'translate-y-[4px] shadow-none' : ''}
      `}
      style={{
        boxShadow: isDicePressed ? 'none' : customBoxShadow,
      }}
    >
      <div className="flex gap-2 mb-2">
        <DiceFace value={dice1Value} />
        <DiceFace value={dice2Value} />
      </div>

      <div className="
        bg-[#1a2b3c] // UPDATED: Navy blue background for multiplier display
        text-white // Ensure text is visible on dark background
        text-4xl font-extrabold
        rounded-md p-2 // Added padding and rounded corners for the multiplier box
        min-w-[120px] text-center // Ensure it has a minimum width and centers text
      ">
        {totalMultiplier.toFixed(2)}x
      </div>
    </div>
  );
}