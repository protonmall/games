'use client';

import { useEffect } from 'react';
import { kenoStore } from '@/app/_store/kenoStore';
import { Panel } from '@/app/_components/keno/Panel';
import { Grid } from '@/app/_components/keno/Grid';
import { Multipliers } from '@/app/_components/keno/Multipliers';
import { Result } from '@/app/_components/keno/Result';

export default function KenoPage() {
  const {
    autoPlay,
    playRound,
    betAmount,
    selected,
    completedAutoRounds,
    autoRoundLimit,
    setAutoPlay,
    incrementAutoRound,
    resetAutoRounds,
  } = kenoStore();

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {

      if (completedAutoRounds >= autoRoundLimit) {
        setAutoPlay(false);
        resetAutoRounds();
        clearInterval(interval);
        return;
      }

      playRound();
      incrementAutoRound();
    }, 2000);

    return () => clearInterval(interval);
  }, [
    autoPlay,
    betAmount,
    selected,
    completedAutoRounds,
    autoRoundLimit,
    playRound,
    setAutoPlay,
    incrementAutoRound,
    resetAutoRounds,
  ]);

  return (
    <main className="flex gap-6 p-6 bg-[#0f1115] min-h-screen text-white">
      <Panel />
      <div className="flex-1 flex flex-col">
        <Grid />
        <Multipliers />
        <Result />
      </div>
    </main>
  );
}
