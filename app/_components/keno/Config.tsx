'use client';

import { kenoStore } from '@/app/_store/kenoStore';
import { useCommonStore } from '@/app/_store/commonStore';

export const Config = () => {
  const {
    selected,
    playRound,
    reset,
    autoPlay,
    setAutoPlay,
    betAmount,
    completedAutoRounds,
    autoRoundLimit,
  } = kenoStore();

  const balance = useCommonStore((state) => state.balance);

  const handlePlay = () => {
    if (autoPlay) return;
    playRound();
  };

  const toggleAutoPlay = () => {
    if (autoPlay) {
      setAutoPlay(false);
    } else if (selected.length > 0 && betAmount > 0 && balance >= betAmount) {
      setAutoPlay(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-zinc-900 text-white rounded shadow">
      {/* Left Stats */}
      <div className="flex flex-col gap-2 text-sm">
        <div>
          🎯 Selected Numbers: <strong>{selected.length}</strong>/10
        </div>
        <div>
          💰 Bet Amount: <strong>{betAmount}</strong> | 🏦 Balance:{' '}
          <strong>{balance.toFixed(2)}</strong>
        </div>
        {autoPlay && (
          <div>
            🔁 Auto Round: {completedAutoRounds} / {autoRoundLimit}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-3 text-sm">
        {/* Manual Play Button */}
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:bg-gray-500"
          disabled={selected.length === 0 || betAmount <= 0 || balance < betAmount || autoPlay}
        >
          🎲 Play Manual
        </button>

        {/* AutoPlay Button */}
        <button
          onClick={toggleAutoPlay}
          className={`px-4 py-2 rounded ${
            autoPlay ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
          disabled={
            selected.length === 0 ||
            betAmount <= 0 ||
            balance < betAmount
          }
        >
          {autoPlay ? '🛑 Stop AutoPlay' : '▶️ Start AutoPlay'}
        </button>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black"
        >
          ♻️ Reset
        </button>
      </div>
    </div>
  );
};





