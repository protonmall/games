'use client';

import { kenoStore } from '@/app/_store/kenoStore';
import { useCommonStore } from '@/app/_store/commonStore';

export const Result = () => {
  const { result, matches, wins, losses } = kenoStore();
  const balance = useCommonStore((state) => state.balance); // ✅ correct source

  return (
    <div className="mt-4 text-center text-sm space-y-2">
      <div>
        🎯 Matches: <strong>{matches}</strong>
      </div>
      <div>
        💰 Balance: <strong>{balance.toFixed(8)}</strong>
      </div>
      <div>
        ✅ Wins: {wins} | ❌ Losses: {losses}
      </div>
      {result.length > 0 && (
        <div>
          🧮 Drawn:{' '}
          <span className="font-mono">
            {result.slice().sort((a, b) => a - b).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};
