'use client';

import { kenoStore } from '@/app/_store/kenoStore';
import clsx from 'clsx';
import { RISK_LEVELS } from './constants';

export const Multipliers = () => {
  const { matches, risk } = kenoStore();
  const tier = RISK_LEVELS.find(r => r.label === risk)!;

  return (
    <div className="mt-4 bg-[#1e242c] rounded-xl p-3 grid grid-cols-11 gap-1 text-xs text-white">
      {tier.multipliers.map((m, i) => (
        <div
          key={i}
          className={clsx(
            'py-1 rounded text-center',
            matches === i
              ? 'bg-yellow-400 text-black'
              : 'bg-[#232a35]'
          )}
        >
          <div className="font-bold">{m.toFixed(2)}×</div>
          <div className="opacity-60">{i === 0 ? '0 Hits' : `${i} Hits`}</div>
        </div>
      ))}
    </div>
)
}
