'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useCasesStore } from '@/app/_store/casesStore';

const CasesBoard = () => {
  const { difficulty, resultIndex, isRolling } = useCasesStore();
  const [triggerAnim, setTriggerAnim] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const multipliersMap: Record<string, number[]> = {
    easy: [0.1, 0.2, 0.5, 1, 2, 5, 10, 23],
    medium: [0, 0.1, 0.5, 1, 2, 5, 15, 50, 115],
    hard: [0, 0.1, 0.5, 1, 2, 5, 20, 100, 1000],
    expert: [0, 0.1, 0.5, 1, 2, 5, 50, 500, 10000],
  };

  const multipliers = multipliersMap[difficulty];

  const fullReel = [...multipliers, ...multipliers, ...multipliers];

  useEffect(() => {
    if (isRolling) {
      setTriggerAnim(false); // reset
      void containerRef.current?.offsetWidth; // force reflow
      setTriggerAnim(true);
    }
  }, [isRolling]);

  return (
    <div className="relative w-full max-w-2xl overflow-hidden h-20 mt-8 border border-gray-700 rounded-lg bg-neutral-900">
      <div className="pointer top-0 bottom-0 m-auto" />

      <div
        ref={containerRef}
        className={`flex w-max gap-2 px-4 py-4 ${triggerAnim ? 'animate-slide-reel' : ''}`}
      >
        {fullReel.map((m, i) => (
          <div
            key={i}
            className={`min-w-[80px] h-12 flex items-center justify-center text-sm font-bold rounded ${
              m > 1 ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-800'
            } ${resultIndex === i % multipliers.length && !isRolling ? 'animate-glow' : ''}`}
          >
            {m}x
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesBoard;
