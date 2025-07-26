'use client';

import { useEffect, useRef } from 'react';
import { kenoStore } from '@/app/_store/kenoStore';
import { GRID_NUMBERS } from './constants';
import clsx from 'clsx';

export const Grid = () => {
  const { selected, result, isSpinning } = kenoStore((state) => ({
    selected: state.selected,
    result: state.result,
    isSpinning: state.isSpinning,
  }));

  const matchSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isSpinning && result.length > 0) {
      // Play sound once per match
      const hits = result.filter((n) => selected.includes(n));
      if (hits.length > 0) {
        matchSoundRef.current?.play().catch(() => {});
      }
    }
  }, [result, isSpinning]);

  return (
    <div className="grid grid-cols-8 gap-2 p-4 bg-[#14181f] rounded-xl">
      {GRID_NUMBERS.map((n, index) => {
        const isSelected = selected.includes(n);
        const isHit = result.includes(n);
        const isMatched = isSelected && isHit;

        return (
          <button
            key={n}
            onClick={() => kenoStore.getState().toggleNumber(n)}
            disabled={isSpinning}
            className={clsx(
              'w-12 h-12 flex items-center justify-center rounded font-bold transition-all duration-300',
              isMatched
                ? 'bg-yellow-400 text-black animate-glow'
                : isSelected
                ? 'bg-purple-500 text-white'
                : isHit
                ? 'bg-green-500 text-black animate-scale-up'
                : 'bg-gray-800 text-gray-400',
              isSpinning && 'animate-pulse'
            )}
            style={{
              animationDelay: `${index * 25}ms`,
              animationFillMode: 'both',
            }}
          >
            {n}
          </button>
        );
      })}

      {/* 🔊 Match sound */}
      <audio
        ref={matchSoundRef}
        src="https://cdn.pixabay.com/audio/2022/03/15/audio_eb30f1e1a0.mp3"
        preload="auto"
      />
    </div>
  );
};
