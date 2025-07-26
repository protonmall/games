'use client';

import { useState, useEffect } from 'react';
import { kenoStore } from '@/app/_store/kenoStore';
import { GRID_NUMBERS, RISK_LEVELS } from './constants';
import clsx from 'clsx';
import { useCommonStore } from "@/app/_store/commonStore";

export function Panel() {
  const {
    selected,
    betAmount,
    setBetAmount,
    playRound,
    resetGame,
    autoPlay,
    setAutoPlay,
    autoCount,
    setAutoCount,
    completedAutoRounds,
    risk,
    setRisk,
    startAutoplay,
  } = kenoStore();

  const [betInput, setBetInput] = useState('0');
  const [tabMode, setTabMode] = useState<'Manual' | 'Auto'>('Manual'); // ✅ Separate mode
  const balance = useCommonStore((state) => state.balance);

  useEffect(() => {
    setBetInput(String(Math.floor(betAmount)));
  }, [betAmount]);

  const canBet = selected.length > 0 && balance >= betAmount;

  // Quick bet functions
  const half = () => {
    const next = Math.floor(betAmount / 2);
    setBetInput(String(next));
    setBetAmount(next);
  };

  const dbl = () => {
    const next = betAmount * 2;
    setBetInput(String(next));
    setBetAmount(next);
  };

  const max = () => {
    const maxAmt = Math.floor(balance);
    setBetInput(String(maxAmt));
    setBetAmount(maxAmt);
  };

  // Manual mode play
  const handleManualBet = () => {
    if (canBet) playRound();
  };

  // Start AutoPlay
  const handleStartAuto = () => {
    if (!canBet) return;
    startAutoplay(); // ✅ starts looping, sets autoPlay = true
  };

  // Stop AutoPlay
  const stopAuto = () => {
    setAutoPlay(false);
  };

  return (
    <div className="w-72 bg-[#1e242c] rounded-xl p-4 flex flex-col gap-4 text-sm shadow">
      
      {/* Mode Tabs */}
      <div className="flex bg-[#232a35] rounded-full p-1">
        {['Manual', 'Auto'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setTabMode(tab as 'Manual' | 'Auto'); // ✅ change tab only
              kenoStore.getState().resetAutoRounds();
            }}
            className={clsx(
              'flex-1 py-1 rounded-full transition',
              tabMode === tab && 'bg-[#2f3745]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bet Input */}
      <div className="flex items-center gap-2">
        <span>Bet</span>
        <input
          type="number"
          min={1}
          className="flex-1 bg-[#232a35] rounded px-2 py-1 text-right"
          value={betInput}
          onChange={(e) => {
            const val = e.target.value;
            setBetInput(val);
            const num = parseInt(val, 10);
            setBetAmount(!isNaN(num) ? num : 0);
          }}
        />
      </div>

      {/* Quick Bet */}
      <div className="flex gap-2">
        <button onClick={half} className="flex-1 bg-[#232a35] rounded py-1">½</button>
        <button onClick={dbl} className="flex-1 bg-[#232a35] rounded py-1">2×</button>
        <button onClick={max} className="flex-1 bg-[#232a35] rounded py-1">MAX</button>
      </div>

      {/* Risk Selector */}
      <div className="flex flex-col">
        <label>Risk</label>
        <select
          className="bg-[#232a35] rounded px-2 py-1"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          {RISK_LEVELS.map((r) => (
            <option key={r.label} value={r.label}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Rounds input if Auto tab */}
      {tabMode === 'Auto' && (
        <div className="flex items-center gap-2">
          <label>Rounds</label>
          <input
            type="number"
            className="bg-[#232a35] rounded px-2 py-1 w-20"
            value={autoCount}
            onChange={(e) =>
              setAutoCount(Math.max(1, parseInt(e.target.value, 10)))
            }
          />
        </div>
      )}

      {/* Auto Pick + Clear */}
      <button
        onClick={() => {
          const pool = [...GRID_NUMBERS].sort(() => 0.5 - Math.random());
          kenoStore.setState({ selected: pool.slice(0, 10) });
        }}
        className="w-full bg-[#232a35] rounded py-2"
      >
        Auto Pick
      </button>
      <button
        onClick={() => resetGame()}
        className="w-full bg-[#232a35] rounded py-2"
      >
        Clear Table
      </button>

      {/* Manual Play */}
      {tabMode === 'Manual' && (
        <button
          onClick={handleManualBet}
          disabled={!canBet}
          className={clsx(
            'w-full rounded py-2 font-bold transition',
            canBet ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 cursor-not-allowed'
          )}
        >
          Bet
        </button>
      )}

      {/* Auto Play Controls */}
      {tabMode === 'Auto' && !autoPlay && (
        <button
          onClick={handleStartAuto}
          disabled={!canBet}
          className={clsx(
            'w-full rounded py-2 font-bold transition',
            canBet ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'
          )}
        >
          Start Auto
        </button>
      )}

      {tabMode === 'Auto' && autoPlay && (
        <>
          <button
            onClick={stopAuto}
            className="w-full bg-red-500 hover:bg-red-600 rounded py-2 font-bold"
          >
            Stop Auto
          </button>
          <div className="text-xs text-center mt-2">
            🔁 {completedAutoRounds} / {autoCount} Rounds
          </div>
        </>
      )}
    </div>
  );
}
